angular.module('App.Admin')
  .controller('AdminCtrl', function ($scope, $interval, ContestSvc, socketio) {

    $scope.actions = [{
      label: 'create contest',
      template: 'admin/create-contest/create-contest.html'
    }, {
      label: 'manage contests',
      template: 'admin/manage-contests.html'
    }, {
      label: 'manage contestants',
      template: 'admin/manage-contestants.html'
    }, {
      label: 'manage refrees',
      template: 'admin/manage-refrees.html'
    }];

    $scope.$on('contests-loaded', function () {
      console.log('admin: contests-loaded');
      $scope.contests = _.filter($scope.contests, { hasEnded: false });
      $scope.setSelected($scope.contests[0]);
    });

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

    // Socket.io events firing

    $scope.alertRefrees = function () {
      console.log('alerting refrees');
      $scope.allVotesCollected = true;
    };

    $scope.startContest = function () {
      socketio.emit('main:startContest', { _id: $scope.selected._id });
    };

    $scope.endContest = function () {
      stopTimer();
      socketio.emit('main:endContest', { _id: $scope.selected._id });
    };

    $scope.pauseContest = function () {
      stopTimer();
      socketio.emit('main:pauseContest', { _id: $scope.selected._id });
    };

    $scope.resumeContest = function () {
      startTimer();
      socketio.emit('main:resumeContest', { _id: $scope.selected._id });
    };

    $scope.votingStarted = function () {
      startTimer();
      socketio.emit('main:votingStarted', { _id: $scope.selected._id });
    };

    $scope.votingEnded = function () {
      socketio.emit('main:votingEnded', { _id: $scope.selected._id });
    };

    $scope.alertRefrees = function () {
      socketio.emit('main:alertRefrees', { _id: $scope.selected._id });
    };

    $scope.nextContestant = function () {
      resetTimer();
      socketio.emit('main:nextContestant', { _id: $scope.selected._id });
    };

  });
