angular.module('App.Admin')
  .controller('GroupsCtrl', function ($scope) {

    $scope.tabIndex = 0;

    $scope.groups = [{
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

    $scope.getGroups.get = function () {
      return $scope.groups;
    };

    $scope.addGroup = function () {
      var label;
      if ($scope.groupTitle) {
        label = $scope.groupTitle;
      }
      else {
        label = 'Group ' + String.fromCharCode($scope.groups.length + 65);
      }
      $scope.groups.push({
        label: label,
        refrees: [],
        contestants: []
      });
      $scope.groupTitle = '';
    };

    $scope.removeCurrentGroup = function () {
      $scope.groups.splice($scope.tabIndex, 1);
    };

  });
