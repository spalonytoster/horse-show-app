angular.module('App')
  .controller('RefreeCtrl', function ($scope, socketio) {

    $scope.$on('contests-loaded', function () {
      console.log('admin: contests-loaded');
      $scope.contests = _.filter($scope.contests, function (contest) {
        // if (!contest.hasEnded) {
        //   contest.groups.forEach(function (group) {
        //     group.refrees.forEach(function (refree) {
        //       if (refree.username === $scope.currentUser.username) {
        //
        //       }
        //     });
        //   });
        // }
        return !contest.hasEnded;
      });
      $scope.setSelected($scope.contests[0]);
    });

    socketio.on('main:alertRefrees', function (nameFormatted) {
      if ($scope.selected.nameFormatted === nameFormatted) {
        console.log('HURRY UP REFREE!');
      }
    });

  });
