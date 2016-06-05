app.controller('CreateContestCtrl', function($scope) {
  $scope.tabs = [{
    label: 'contest info',
    template: 'admin/create-contest/contest-info.html',
    disabled: false
  },{
    label: 'contestants',
    template: 'admin/create-contest/contestants.html',
    disabled: true
  },{
    label: 'refrees',
    template: 'admin/create-contest/refrees.html',
    disabled: true
  },{
    label: 'groups',
    template: 'admin/create-contest/groups.html',
    disabled: true
  },];

  $scope.next = function() {
    $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2);
  };
  $scope.previous = function() {
    $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
  };
});
