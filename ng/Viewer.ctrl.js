app.controller('ViewerCtrl', function ($scope, $mdSidenav, TournamentSvc) {
  TournamentSvc.getTournaments().success(function (tournaments) {
    $scope.tournaments = tournaments;
    $scope.selected = $scope.tournaments[0];
  });

  $scope.setSelected = function (tournament) {
    $scope.selected = tournament;
  };

  $scope.toggleSidebar = function () {
    $mdSidenav('sidebar').toggle();
  };
});
