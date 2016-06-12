angular.module('App')
  .controller('ContestCtrl', function ($scope, $interval) {

    var VOTING_TIME = 10;

    $scope.timeLeft = VOTING_TIME;
    $scope.timesUp = false;
    $scope.allVotesCollected = false;

    // Timer stuff

    var stop;

    var stopTimer = function () {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    };

    $scope.$on('start-timer', function () {
      // won't start a new timer if there is one existing
      console.log('timer started');
      if (angular.isDefined(stop)) return;

      stop = $interval(function () {
        if ($scope.timeLeft > 0) {
          $scope.timeLeft--;
        } else {
          stopTimer();
          $scope.timesUp = true;
        }
      }, 1000);
    });

    $scope.$on('stop-timer', stopTimer);

    $scope.$on('reset-timer', function () {
      $scope.timeLeft = VOTING_TIME;
    });

    $scope.$on('$destroy', function () {
      stopTimer(); // Make sure that the interval is destroyed
    });

  });
