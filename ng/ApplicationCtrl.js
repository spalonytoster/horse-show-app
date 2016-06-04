app.controller('ApplicationCtrl', function ($scope, $mdSidenav) {
  $scope.toggleSidebar = function () {
    $mdSidenav('sidebar').toggle();
  };
});
