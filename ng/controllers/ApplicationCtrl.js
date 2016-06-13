angular.module('App')
  .controller('ApplicationCtrl', function ($scope, $rootScope, $mdSidenav,
                                           $http, $location, LoginSvc, HorseSvc,
                                           ContestSvc, socketio, $timeout) {

    $scope.toggleSidebar = function () {
      $mdSidenav('sidebar').toggle();
    };

    // Login utils

    $scope.$on('login', function (_, user) {
      $scope.currentUser = user;
    });

    $scope.logout = function () {
      LoginSvc.logout();
      delete $scope.currentUser;
      delete window.localStorage.token;
      $location.path('/login');
    };

    if (window.localStorage.token) {
      // console.log('token from localStorage: ' + window.localStorage.token);
      $http.defaults.headers.common['X-auth'] = window.localStorage.token;
      LoginSvc.getUser()
      .success(function (response) {
        // console.log('current user vvv');
        // console.log(response);
        $scope.currentUser = response;
      });
    }

    // Contest utils

    $scope.getMomentDate = function (date) {
      return moment(date).calendar();
    };

    $scope.getAverageScore = function (scores) {
      if (!scores) {
        return 0;
      }
      var avgScore = 0;
      scores.forEach(function (score) {
        avgScore += score.value;
      });
      avgScore /= scores.length;
      return avgScore;
    };

    $scope.setSelected = function (contest) {
      if (!contest) {
        return;
      }
      if (contest.template) {
        $scope.selected = contest;
        return;
      }
      $scope.selected = { ready: false };
      ContestSvc.getOne(contest.nameFormatted)
      .success(function (data) {
        $scope.selected = data;
        $scope.selected.ready = true;
        $scope.selectedGroupInput = data.groups[0].name;
        $scope.changeGroup($scope.selectedGroupInput);
        console.log($scope.selected);

        if ($scope.selected.currentVoting && $scope.selected.currentVoting.contestant &&
            $scope.selected.currentVoting.contestant.horse) {
          HorseSvc.getOne($scope.selected.currentVoting.contestant.horse)
          .success(function (horse) {
            $scope.selected.currentVoting.contestant.horse = horse;
            $scope.$broadcast('contest-loaded');
          });
        }
      });
    };

    $scope.changeGroup = function (groupName) {
      $scope.selected.groups.forEach(function (group) {
        if (group.name === groupName) {
          console.log('group changed to ' + group.name);
          $scope.selectedGroup = group;
        }
      });
    };

    $scope.updateContest = function (nameFormatted, callback) {
      $scope.contests.forEach(function (contest) {
        if (nameFormatted === contest.nameFormatted) {
          callback(contest);
          callback($scope.selected);
        }
      });
    };

    // Timer control

    var startTimer = function () {
      $scope.$broadcast('start-timer');
    };

    var stopTimer = function () {
      $scope.$broadcast('stop-timer');
    };

    var resetTimer = function () {
      $scope.$broadcast('reset-timer');
    };

    // Socket.io listeners

    socketio.on('main:startContest', function (data) {
      console.log('contest started');
      $scope.updateContest(data.nameFormatted, function (contest) {
        contest.liveNow = true;
        contest.currentVoting.timeLeft = data.timeLeft;
      });
      HorseSvc.getOne(data.contestant.horse)
      .success(function (horse) {
        $scope.selected.currentVoting.contestant.horse = horse;
        $scope.$broadcast('contest-loaded');
      });
      $scope.$broadcast('refresh-timer');
    });

    socketio.on('main:endContest', function (nameFormatted) {
      console.log('contest ended');
      stopTimer();
      $scope.updateContest(nameFormatted, function (contest) {
        contest.liveNow = false;
        contest.hasEnded = true;
      });
    });

    socketio.on('main:pauseContest', function (nameFormatted) {
      stopTimer();
      $scope.updateContest(nameFormatted, function (contest) {
        contest.currentVoting.isPaused = true;
      });
    });

    socketio.on('main:resumeContest', function (nameFormatted) {
      startTimer();
      $scope.updateContest(nameFormatted, function (contest) {
        contest.currentVoting.isPaused = false;
      });
    });

    socketio.on('main:votingStarted', function (nameFormatted) {
      console.log('voting started');
      startTimer();
      $scope.updateContest(nameFormatted, function (contest) {
        contest.currentVoting.votingStarted = true;
      });
    });

    socketio.on('main:votingEnded', function (nameFormatted) {
      $scope.updateContest(nameFormatted, function (contest) {
        contest.currentVoting.votingStarted = false;
      });
    });

    socketio.on('main:nextContestant', function (data) {
      $scope.allVotesCollected = false;
      resetTimer();
      console.log(data);
      if (data.noMoreContestants) {
        $scope.$broadcast('no-more-contestants');
      }
      else {
        $scope.updateContest(data.nameFormatted, function (contest) {
          if (!contest.currentVoting.contestant) {
            contest.currentVoting.contestant = {};
          }
          contest.currentVoting.contestant.index = data.contestantIndex;
          contest.currentVoting.contestant.number = data.contestant.number;
          HorseSvc.getOne(data.contestant.horse)
          .success(function (horse) {
            contest.currentVoting.contestant.horse = horse;
          });
          contest.currentVoting.contestant.horse = data.contestant.horse;
        });
      }
      $scope.$broadcast('next-contestant');
    });

    socketio.on('main:updateScores', function (data) {
      $scope.updateContest(data.nameFormatted, function (contest) {
        Array.prototype.push.apply(contest.groups[contest.currentVoting.group].contestants[contest.currentVoting.contestant.index].scores, data.scores);
      });
    });

    socketio.on('main:updateScores', function () {
      $scope.allVotesCollected = true;
      // TODO update scoretables
    });

    // Retrieving contests list on application start

    ContestSvc.getAll().success(function (contests) {
      $scope.contests = contests;
      $timeout(function () {
        $scope.$broadcast('contests-loaded');
      }, 50);
    });

  });
