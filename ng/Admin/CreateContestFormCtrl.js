angular.module('App.Admin')
  .controller('CreateContestFormCtrl', function($scope) {

    $scope.contest = {};

    $scope.getContestInfo.get = function () {
      return $scope.contest;
    };
  });
