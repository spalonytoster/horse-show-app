angular.module('App.Admin')
  .controller('ContestantsCtrl', function ($scope, HorseSvc) {
    'use strict';

    HorseSvc.getAll()
      .success(function(data) {
        $scope.horses = data;
      });

    $scope.limitOptions = [5, 10, 15];

    $scope.options = {
      rowSelection: true,
      multiSelect: true,
      autoSelect: true,
      decapitate: false,
      largeEditDialog: false,
      boundaryLinks: false,
      limitSelect: true,
      pageSelect: true
    };

    $scope.query = {
      order: 'name',
      limit: 5,
      page: 1
    };

    $scope.logOrder = function(order) {
      console.log('order: ', order);
    };

    $scope.logItem = function(item) {
      console.log(item.name, 'was selected');
      console.log($scope.startingList);
    };

  });
