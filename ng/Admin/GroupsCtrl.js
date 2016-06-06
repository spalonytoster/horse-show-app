angular.module('App.Admin')
  .controller('GroupsCtrl', function ($scope) {

    $scope.tabIndex = 0;

    $scope.groups = [{
      name: 'Group A',
      refrees: [],
      contestants: []
    }, {
      name: 'Group B',
      refrees: [],
      contestants: []
    }, {
      name: 'Group C',
      refrees: [],
      contestants: []
    }];

    $scope.getGroups.get = function () {
      return $scope.groups;
    };

    $scope.addGroup = function () {
      var name;
      if ($scope.groupTitle) {
        name = $scope.groupTitle;
      }
      else {
        name = 'Group ' + String.fromCharCode($scope.groups.length + 65);
      }
      $scope.groups.push({
        name: name,
        refrees: [],
        contestants: []
      });
      $scope.groupTitle = '';
    };

    $scope.removeCurrentGroup = function () {
      $scope.groups.splice($scope.tabIndex, 1);
    };

  });
