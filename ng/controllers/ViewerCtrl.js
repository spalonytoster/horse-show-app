angular.module('App')
  .controller('ViewerCtrl', function ($scope, $mdSidenav, ContestSvc) {

    ContestSvc.getAll().success(function (contests) {
      $scope.contests = contests;
      $scope.setSelected($scope.contests[0]);
    });

  });
