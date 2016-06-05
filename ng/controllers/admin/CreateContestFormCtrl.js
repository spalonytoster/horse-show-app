app.controller('CreateContestFormCtrl', function($scope) {

  $scope.next = function () {
    $scope.data.selectedIndex = Math.min($scope.selectedIndex + 1, $scope.tabs.length);
  };

  $scope.previous = function () {
    $scope.data.selectedIndex = Math.max($scope.selectedIndex - 1, 0);
  };

  $scope.cancel = function () {
    $scope.selectedIndex = 0;
    if ($scope.contest) {
      $scope.contest = {};
    }
  };

});
