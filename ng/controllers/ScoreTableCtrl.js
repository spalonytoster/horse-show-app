angular.module('App')
  .controller('ScoreTableCtrl', function ($scope, ContestSvc) {

    $scope.options = {
      rowSelection: false,
      multiSelect: false,
      autoSelect: false,
      decapitate: false,
      largeEditDialog: false,
      boundaryLinks: false,
      limitSelect: false,
      pageSelect: true
    };

    $scope.query = {
      order: 'name',
      limit: 5,
      page: 1
    };

  });
