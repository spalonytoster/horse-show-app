angular.module('App')
  .controller('ViewerCtrl', function ($scope, ContestSvc) {

    ContestSvc.getAll().success(function (contests) {
      $scope.contests = contests;
      if ($scope.contests.length > 0) {
        $scope.setSelected($scope.contests[0]);
      }
    });

  });
