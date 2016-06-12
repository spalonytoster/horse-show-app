/* jshint node: true */
"use strict";

var jwt = require('jwt-simple'),
  config = require('./config'),
  Person = require('./models/person.js'),
  Contest = require('./models/contest.js');

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
                  contest.liveNow = true;
                  contest.currentVoting.group = 0;
                  contest.save(function(err) {
                    console.log('admin started ' + contest.name);
                    io.of('/main').emit('main:startContest', contest.nameFormatted);
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
                    io.of('/main').emit('main:pauseContest', contest.nameFormatted);
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
                  // contest.currentVoting.votingStarted = true;
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
                  if (typeof contest.currentVoting.contestant === 'undefined') {
                    contest.currentVoting.contestant = {
                      index: 0
                    };
                    console.log('created contest.currentVoting.contestant');
                  }
                  else {
                    contest.currentVoting.contestant.index++;
                  }
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
                  contest.save(function(err) {
                    console.log('next contestant ' + contest.name);
                    io.of('/main').emit('main:nextContestant', contest.nameFormatted, contestantToRet, contest.currentVoting.contestant.index);
                  });
                });
              }
            });
            socket.on('main:startTimer', function(data) {
              if (auth.isAdmin()) {
                io.of('/main').emit('main:startTimer', data);
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
          });
        })
    }
  };
};
