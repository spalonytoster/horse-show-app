angular.module('App')
  .controller('ScoresCtrl', function ($scope, ContestSvc) {

    $scope.options = {
      rowSelection: false,
      multiSelect: false,
      autoSelect: false,
      decapitate: false,
      largeEditDialog: false,
      boundaryLinks: false,
      limitSelect: false,
      pageSelect: true
    };

    $scope.query = {
      order: 'name',
      limit: 5,
      page: 1
    };

    $scope.data = {};

    $scope.$on('contest-loaded', function () {
      var groupIndex = $selected.currentVoting.group,
          contestantIndex = $selected.currentVoting.contestant.index;
      $selected.groups[groupIndex].contestants[contestantIndex].scores.forEach(function (score) {
        
      });
    });

  });
