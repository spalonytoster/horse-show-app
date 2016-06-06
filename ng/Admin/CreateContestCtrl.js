angular.module('App.Admin')
  .controller('CreateContestCtrl', function($scope) {

    $scope.tabIndex = 0;
    $scope.startingList = [];
    $scope.chosenRefrees = [];
    $scope.groups = [];

    $scope.tabs = [{
      label: 'contest info',
      template: 'admin/create-contest/contest-info.html',
      disabled: false
    }, {
      label: 'contestants',
      template: 'admin/create-contest/contestants.html',
      disabled: true
    }, {
      label: 'refrees',
      template: 'admin/create-contest/refrees.html',
      disabled: true
    }, {
      label: 'groups',
      template: 'admin/create-contest/groups.html',
      disabled: true
    }];

    $scope.next = function() {
      $scope.tabIndex = Math.min($scope.tabIndex + 1, 3);
    };

    $scope.previous = function() {
      $scope.tabIndex = Math.max($scope.tabIndex - 1, 0);
    };

    $scope.isLastTab = function () {
      return $scope.tabIndex === $scope.tabs.length-1;
    };

    $scope.$on('createContestRes', function (event, data) {
        $scope.groups = data;
    });

    $scope.finish = function () {
      return $scope.groups.get();

    };

  });
