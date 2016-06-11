angular.module('App')
  .controller('ContestCtrl', function($scope, $interval, socketio) {

    $scope.timeLeft = 10;
    $scope.timesUp = false;
    $scope.allVotesCollected = false;

    var stop;
    $scope.startTimer = function () {
      // won't start a new timer if there is one existing
      if (angular.isDefined(stop)) return;

      stop = $interval(function () {
        if ($scope.timeLeft > 0) {
          $scope.timeLeft--;
        } else {
          $scope.stopTimer();
          $scope.timesUp = true;
        }
      }, 1000);

      socketio.emit('main:startContest', { nameFormatted: $scope.selected.nameFormatted });
      $scope.contests.forEach(function (contest, i) {
        if (contest.nameFormatted === $scope.selected.nameFormatted) {
          $scope.contests[i].liveNow = true;
          $scope.selected.liveNow = true;
          console.log($scope.contests[i].name + ' is now live');
        }
      });
    };

    $scope.stopTimer = function () {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    };

    $scope.resetTimer = function () {
      $scope.timeLeft = 120;
    };

    $scope.$on('$destroy', function () {
      // Make sure that the interval is destroyed
      $scope.stopTimer();
    });

    $scope.alertRefrees = function () {
      console.log('alerting refrees');
      $scope.allVotesCollected = true;
    };

  });
