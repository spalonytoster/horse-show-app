app.controller('ViewerCtrl', function ($scope, $mdSidenav) {
  $scope.tournaments = [
    {
      name: '#1 Grand Prix',
      location: 'Amsterdam',
      date: new Date(),
      scoreTable: {
        value: "test1"
      }
    },
    {
      name: 'Mid-season Junior Open',
      location: 'London',
      date: new Date(),
      scoreTable: {
        value: "test2"
      }
    },
    {
      name: 'Horses for charity!',
      location: 'Amsterdam',
      date: new Date(),
      scoreTable: {
        value: "test3"
      }
    }
  ];
  $scope.selected = $scope.tournaments[0];
  $scope.setSelected = function (tournament) {
    $scope.selected = tournament;
  };

  $scope.toggleSidebar = function () {
    $mdSidenav('sidebar').toggle();
  };
});
