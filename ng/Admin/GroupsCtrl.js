angular.module('App.Admin')
  .controller('GroupsCtrl', function ($scope) {

    $scope.tabs = [{
      label: 'Group A',
      refrees: [],
      contestants: []
    }, {
      label: 'Group B',
      refrees: [],
      contestants: []
    }, {
      label: 'Group C',
      refrees: [],
      contestants: []
    }];

    $scope.addGroup = function () {
      $scope.tabs.push({
        label: 'Group ' + String.fromCharCode($scope.tabs.length + 65),
        refrees: [],
        contestants: []
      });
    };


  });
