angular.module('App.Admin')
  .controller('AdminCtrl', function ($scope, $interval, ContestSvc, socketio) {

    $scope.actions = [{
      label: 'welcome page',
      template: 'admin/welcome-page.html'
    }, {
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
      if ($scope.contests.length > 0) {
        $scope.setSelected($scope.contests[0]);
      }
      else {
        $scope.setSelected($scope.actions[0]);
      }
    });

    // Socket.io events firing

    $scope.alertRefrees = function () {
      console.log('alerting refrees');
      $scope.allVotesCollected = true;
    };

    $scope.startContest = function () {
      socketio.emit('main:startContest', { _id: $scope.selected._id });
    };

    $scope.endContest = function () {
      socketio.emit('main:stopTimer', { _id: $scope.selected.nameFormatted });
      socketio.emit('main:endContest', { _id: $scope.selected._id });
    };

    $scope.pauseContest = function () {
      socketio.emit('main:stopTimer', { _id: $scope.selected.nameFormatted });
      socketio.emit('main:pauseContest', { _id: $scope.selected._id });
    };

    $scope.resumeContest = function () {
      socketio.emit('main:startTimer', { _id: $scope.selected.nameFormatted });
      socketio.emit('main:resumeContest', { _id: $scope.selected._id });
    };

    $scope.votingStarted = function () {
      socketio.emit('main:startTimer', { _id: $scope.selected.nameFormatted });
      socketio.emit('main:votingStarted', { _id: $scope.selected._id });
    };

    $scope.votingEnded = function () {
      socketio.emit('main:votingEnded', { _id: $scope.selected._id });
    };

    $scope.alertRefrees = function () {
      socketio.emit('main:alertRefrees', { _id: $scope.selected._id });
    };

    $scope.nextContestant = function () {
      socketio.emit('main:resetTimer', { _id: $scope.selected.nameFormatted });
      socketio.emit('main:nextContestant', { _id: $scope.selected._id });
    };

  });
