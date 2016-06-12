angular.module('App')
  .controller('ApplicationCtrl', function ($scope, $rootScope, $mdSidenav,
                                           $http, $location, LoginSvc,
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

    socketio.on('main:startContest', function (nameFormatted) {
      console.log('contest started');
      $scope.updateContest(nameFormatted, function (contest) {
        contest.liveNow = true;
      });
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
      startTimer();
    });

    socketio.on('main:votingEnded', function (nameFormatted) {
      $scope.updateContest(nameFormatted, function (contest) {
        contest.currentVoting.votingStarted = false;
      });
    });

    socketio.on('main:nextContestant', function (nameFormatted) {
      resetTimer();
      $scope.updateContest(nameFormatted, function (contest) {
        // TODO
      });
    });



    // Retrieving contests list on application start

    ContestSvc.getAll().success(function (contests) {
      $scope.contests = contests;
      $timeout(function () {
        $scope.$broadcast('contests-loaded');
      }, 50);
      if ($scope.contests.length > 0) {
        $scope.setSelected($scope.contests[0]);
      }
    });

  });
