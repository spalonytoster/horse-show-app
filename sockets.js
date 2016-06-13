/* jshint node: true */
"use strict";

var jwt = require('jwt-simple'),
    config = require('./config'),
    Person = require('./models/person.js'),
    Contest = require('./models/contest.js'),
    _ = require('lodash');
var timer, VOTING_TIME = 10;

var authenticateClient = function(token, socket, callback) {
  var auth;
  try {
    auth = jwt.decode(token, config.secret);
    if (typeof auth.role === 'string' && (auth.role === 'admin' || auth.role === 'refree')) {
      Person.findOne({
          username: auth.username,
          role: auth.role
        })
        .select('username')
        .select('role')
        .exec(function(err, user) {
          auth = {};
          if (err) {
            console.log('WS: connection closed: database error');
            socket.disconnect('unauthorized');
            return auth;
          }
          auth = {
            username: user.username,
            role: user.role,
            isAdmin: function() {
              return this.role === 'admin';
            },
            isRefree: function() {
              return this.role === 'refree';
            }
          };
          callback(auth);
        });
    }
  } catch (e) {
    console.log('WS: connection closed: invalid token');
    return auth;
  }
};

var nextContestant = function (io, contest) {
  if (typeof contest.currentVoting.contestant.index === 'undefined') {
    contest.currentVoting.contestant.index = 0;
  }
  else if (contest.currentVoting.contestant.index+1 ===
    contest.groups[contest.currentVoting.group].contestants.length) {
      contest.currentVoting.contestant.index = 0;
      if (contest.currentVoting.group+1 === contest.groups.length) {
        io.of('/main').emit('main:nextContestant', { noMoreContestants: true });
        return;
      }
      contest.currentVoting.group++;
  }
  else {
    contest.currentVoting.contestant.index++;
  }
  console.log('contestant.index:' + contest.currentVoting.contestant.index);
  var contestantToRet = contest.groups[contest.currentVoting.group].contestants[contest.currentVoting.contestant.index];
  contest.currentVoting.contestant.horse = contestantToRet.horse;
  contest.currentVoting.contestant.number = contestantToRet.number;
  contest.groups.forEach(function(group) {
    if (group.name === contest.currentVoting.group.name) {
      group.refrees.forEach(function(refree) {
        config.scoreTypes.forEach(function(scoreType) {
          contest.currentVoting.scores.push({
            type: scoreType,
            value: 0,
            refree: refree._id
          });
        });
      });
    }
  });
  contest.currentVoting.scores.forEach(function (score) {
    score.value = 0;
  });
  contest.save(function(err) {
    console.log('next contestant ' + contest.name);
    io.of('/main').emit('main:nextContestant', {
      nameFormatted: contest.nameFormatted,
      contestant: contestantToRet,
      contestantIndex: contest.currentVoting.contestant.index
    });
  });
};

exports.ensureToken = function(socket, next) {
  var token, auth;
  if (!socket.handshake.query.token) {
    console.log("WS: Token has not been supplied.");
    return;
  }
  token = socket.handshake.query.token;
  console.log('WS token: ' + token);
  next();
};

exports.init = function(io) {
  return {
    channels: {
      main: io.of('/main')
        .on('connection', function(socket) {
          authenticateClient(socket.handshake.query.token, socket, function(auth) {
            console.log(auth.role + ' has connected to main channel');

            socket.on('main:startContest', function(data) {
              if (auth.isAdmin()) {
                Contest.findById(data._id, function(err, contest) {
                  if (err) {
                    return;
                  }
                  contest.currentVoting.refreesSubmitted.push({ contest: contest._id, value: 0, refrees: [] });
                  contest.liveNow = true;
                  if (!contest.currentVoting) {
                    contest.currentVoting = {};
                  }
                  contest.currentVoting.group = 0;
                  contest.currentVoting.timeLeft = VOTING_TIME;
                  contest.currentVoting.contestant.horse = contest.groups[0].contestants[0].horse;

                  contest.groups[contest.currentVoting.group].refrees.forEach(function(refree) {
                    config.scoreTypes.forEach(function(scoreType) {
                      contest.currentVoting.scores.push({
                        scoreType: scoreType,
                        value: 0,
                        refree: refree
                      });
                    });
                  });

                  console.log(contest.currentVoting.scores);

                  contest.save(function(err) {
                    if (err) { console.log(err); return; }
                    console.log('admin started ' + contest.name);
                    var result = {
                      nameFormatted: contest.nameFormatted,
                      timeLeft: contest.currentVoting.timeLeft,
                      contestant: contest.currentVoting.contestant
                    };
                    io.of('/main').emit('main:startContest', result);
                  });
                });
              }
            });
            socket.on('main:endContest', function(data) {
              if (auth.isAdmin()) {
                Contest.findById(data._id, function(err, contest) {
                  if (err) {
                    return;
                  }
                  contest.currentVoting = {};
                  contest.hasEnded = true;
                  contest.save(function(err) {
                    console.log('admin paused ' + contest.name);
                    io.of('/main').emit('main:endContest', contest.nameFormatted);
                  });
                });
              }
            });
            socket.on('main:pauseContest', function(data) {
              if (auth.isAdmin()) {
                Contest.findById(data._id, function(err, contest) {
                  if (err) {
                    return;
                  }
                  contest.currentVoting.isPaused = true;
                  contest.save(function(err) {
                    console.log('admin paused ' + contest.name);
                    io.of('/main').emit('main:pauseContest', contest.nameFormatted);
                  });
                });
              }
            });
            socket.on('main:resumeContest', function(data) {
              if (auth.isAdmin()) {
                Contest.findById(data._id, function(err, contest) {
                  if (err) {
                    return;
                  }
                  contest.currentVoting.isPaused = false;
                  contest.save(function(err) {
                    console.log('admin resumed ' + contest.name);
                    io.of('/main').emit('main:resumeContest', contest.nameFormatted);
                  });
                });
              }
            });
            socket.on('main:votingStarted', function(data) {
              if (auth.isAdmin()) {
                Contest.findById(data._id, function(err, contest) {
                  if (err) {
                    return;
                  }
                  contest.currentVoting.votingStarted = true;
                  contest.save(function(err) {
                    console.log('admin started voting ' + contest.name);
                    io.of('/main').emit('main:votingStarted', contest.nameFormatted);
                  });
                });
              }
            });
            socket.on('main:votingEnded', function(data) {
              if (auth.isAdmin()) {
                Contest.findById(data._id, function(err, contest) {
                  if (err) {
                    return;
                  }
                  contest.currentVoting.votingStarted = false;
                  contest.save(function(err) {
                    console.log('voting phase ended ' + contest.name);
                    io.of('/main').emit('main:votingEnded', contest.nameFormatted);
                  });
                });
              }
            });
            socket.on('main:alertRefrees', function(data) {
              if (auth.isAdmin()) {
                Contest.findById(data._id, function(err, contest) {
                  if (err) { return; }
                  console.log('refrees has been alerted');
                  io.of('/main').emit('main:alertRefrees', contest.nameFormatted);
                });
              }
            });
            socket.on('main:nextContestant', function(data) {
              if (auth.isAdmin()) {
                Contest.findById(data._id, function(err, contest) {
                  if (err) {
                    return;
                  }
                  var refreesSubmitted = _.find(contest.currentVoting.refreesSubmitted, { contest: contest._id });
                  refreesSubmitted.value = 0;
                  refreesSubmitted.refrees = [];
                  nextContestant(io, contest);
                });
              }
            });
            socket.on('main:startTimer', function(data) {
              if (auth.isAdmin()) {
                data.votingTime = VOTING_TIME;
                io.of('/main').emit('main:startTimer', data);
                Contest.findById(data._id, function (err, contest) {
                  contest.currentVoting.timeLeft = VOTING_TIME;
                  timer = setInterval(function () {
                    if (contest.currentVoting.timeLeft > 0) {
                      contest.currentVoting.timeLeft--;
                      contest.save();
                    }
                    else {
                        clearInterval(timer);
                        contest.currentVoting.votingStarted = false;
                        contest.save();
                        io.of('/main').emit('main:votingEnded', contest.nameFormatted);
                    }
                  }, 1000);
                });
              }
            });
            socket.on('main:stopTimer', function(data) {
              if (auth.isAdmin()) {
                io.of('/main').emit('main:stopTimer', data);
              }
            });
            socket.on('main:resetTimer', function(data) {
              if (auth.isAdmin()) {
                io.of('/main').emit('main:resetTimer', data);
              }
            });
            socket.on('main:updateScores', function(data) {
              if (auth.isRefree()) {
                Contest.findById(data._id, function (err, contest) {
                  Person.findOne({ username: auth.username }, function (err, person) {
                    var refreeId = person._id;
                    var scores = _.filter(contest.currentVoting.scores, { refree: refreeId });

                    scores.forEach(function (score) {
                      switch (score.scoreType) {
                        case 'type': score.value = data.scores.type;
                        break;
                        case 'neck': score.value = data.scores.neck;
                        break;
                        case 'body': score.value = data.scores.body;
                        break;
                        case 'legs': score.value = data.scores.legs;
                        break;
                        case 'movement': score.value = data.scores.movement;
                        break;
                        default:
                      }
                    });
                    contest.save();
                  });
                });
              }
            });
            // po kliknieciu submit przez sedziego, jego oceny sa rozsylane do wszystkich
            socket.on('main:broadcastRefreeScores', function(data) {
              if (auth.isRefree()) {
                Contest.findById(data._id, function (err, contest) {
                  console.log(contest.currentVoting.refreesSubmitted);
                  var refreesSubmitted = _.find(contest.currentVoting.refreesSubmitted, { contest: contest._id });
                  refreesSubmitted.value++;
                  if (refreesSubmitted.value >= contest.groups[contest.currentVoting.group].refrees.length) {
                    console.log('all refrees submitted their votes');
                    io.of('/main').emit('main:allVotesCollected', { nameFormatted: contest.nameFormatted });
                  }
                  Person.findOne({ username: auth.username }, function (err, person) {
                    var refreeId = person._id;
                    var scores = _.filter(contest.currentVoting.scores, { refree: refreeId });
                    refreesSubmitted.refrees.push(refreeId);
                    Array.prototype.push.apply(contest.groups[contest.currentVoting.group].contestants[contest.currentVoting.contestant.index].scores, scores);
                    contest.save();
                    io.of('/main').emit('main:updateScores', { nameFormatted: contest.nameFormatted, scores: scores });
                  });
                });
              }
            });
          });
        })
    }
  };
};
