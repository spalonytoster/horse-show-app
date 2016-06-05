angular.module('App.Admin')
  .controller('GroupsCtrl', function ($scope) {

    $scope.tabIndex = 0;

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
      var label;
      if ($scope.groupTitle) {
        label = $scope.groupTitle;
      }
      else {
        label = 'Group ' + String.fromCharCode($scope.tabs.length + 65);
      }
      $scope.tabs.push({
        label: label,
        refrees: [],
        contestants: []
      });
      $scope.groupTitle = '';
    };

    $scope.removeCurrentGroup = function () {
      $scope.tabs.splice($scope.tabIndex, 1);
    };

  });
