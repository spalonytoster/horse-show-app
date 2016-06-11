angular.module('App.Admin')
  .controller('AdminCtrl', function ($scope, ContestSvc) {

    $scope.actions = [{
      label: 'create contest',
      template: 'admin/create-contest/create-contest.html'
    }, {
      label: 'manage contests',
      template: 'admin/manage-contests.html'
    }, {
      label: 'manage contestants',
      template: 'admin/manage-contestants.html'
    }, {
      label: 'manage refrees',
      template: 'admin/manage-refrees.html'
    }];

    ContestSvc.getAll()
      .success(function (contests) {
        $scope.contests = _.filter(contests, { hasEnded: false });
        if ($scope.contests.length > 0) {
          $scope.setSelected($scope.contests[0]);
        }
      });

  });
