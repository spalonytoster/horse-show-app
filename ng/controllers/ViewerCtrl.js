angular.module('App')
  .controller('ViewerCtrl', function ($scope, ContestSvc) {

    $scope.$on('contests-loaded', function () {
      if ($scope.contests.length > 0) {
        $scope.setSelected($scope.contests[0]);
      }
    });

  });
