angular.module('App')
  .controller('ContestCtrl', function($scope, $interval) {

    $scope.timeLeft = 120;

    var stop;
    $scope.startTimer = function () {
      // won't start a new timer if there is one existing
      if (angular.isDefined(stop)) return;

      stop = $interval(function () {
        if ($scope.timeLeft > 0) {
          $scope.timeLeft--;
        } else {
          $scope.stopTimer();
        }
      }, 1000);
    };

    $scope.stopTimer = function () {
      console.log('STOP');
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

  });
