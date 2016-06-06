angular.module('App.Admin')
  .controller('GroupRefreesCtrl', function ($scope) {
    'use strict';

    $scope.refrees = $scope.chosenRefrees;

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
      order: 'surname',
      limit: 5,
      page: 1
    };

    $scope.logOrder = function(order) {
      console.log('order: ', order);
    };

    $scope.logItem = function(item) {
      console.log($scope.group.label + ': ' + $scope.group.refrees);
    };
  });
