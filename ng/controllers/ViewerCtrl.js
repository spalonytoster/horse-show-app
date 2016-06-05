app.controller('ViewerCtrl', function ($scope, $mdSidenav, ContestsSvc, PersonsSvc) {

  $scope.setSelected = function (contest) {
    $scope.selected = contest;
    $scope.selectedGroupInput = contest.groups[0].name;
    $scope.changeGroup($scope.selectedGroupInput);
    console.log($scope.selected);
  };

  $scope.query = {
    order: 'name',
    limit: 5,
    page: 1
  };

  $scope.getMomentDate = function (date) {
    return moment(date).calendar();
  };

  ContestsSvc.getAll().success(function (contests) {
    $scope.contests = contests;
    $scope.setSelected($scope.contests[0]);
  });

  $scope.changeGroup = function (groupName) {
    $scope.selected.groups.forEach(function (group) {
      if (group.name === groupName) {
        console.log('group changed to ' + group.name);
        $scope.selectedGroup = group;
        group.contestants.forEach(function (contestant) {
          PersonsSvc.getOne(contestant.horse.breeder)
          .success(function (breeder) {
            // TODO: update data table
          });
        });
      }
    });
  };

});
