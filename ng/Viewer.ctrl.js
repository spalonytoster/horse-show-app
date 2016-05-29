app.controller('ViewerCtrl', function ($scope, $mdSidenav, ContestsSvc, PersonsSvc) {

  $scope.setSelected = function (contest) {
    $scope.selected = contest;
  };

  $scope.toggleSidebar = function () {
    $mdSidenav('sidebar').toggle();
  };

  $scope.getMomentDate = function (date) {
    return moment(date).calendar();
  };

  $scope.scoreTable = {
    headers: [
      {
        name:'',
        field:'thumb'
      },{
        name: 'No.',
        field: 'number'
      },{
        name: 'Name',
        field: 'name'
      },{
        name:'Sex',
        field: 'sex'
      },{
        name: 'Breeder',
        field: 'breeder'
      },{
        name: 'Score',
        field: 'score'
      }
    ],
    content: [],
    sortable: ['name', 'sex', 'breeder', 'score']
  };

  ContestsSvc.getAll().success(function (contests) {
    $scope.contests = contests;
    $scope.selected = $scope.contests[0];
  });

  $scope.changeGroup = function (groupName) {
    $scope.selected.groups.forEach(function (group) {
      if (group.name === groupName) {
        group.contestants.forEach(function (contestant) {
          $scope.scoreTable.content.push({});
          PersonsSvc.getOne(contestant.horse.breeder)
          .success(function (breeder) {
            var elem = {
              $$hashKey: '',
              thumb: '',
              number: contestant.number,
              name: contestant.horse.name,
              sex: contestant.horse.sex,
              breeder: breeder.name + ' ' + breeder.surname,
              score: contestant.score
            };
            elem.$$hashKey = $scope.scoreTable.content.pop().$$hashKey;
            $scope.scoreTable.content.push(elem);
          });
        });
        console.log($scope.scoreTable.content);
      }
    });
  };

});
