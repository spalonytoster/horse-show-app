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

    $scope.$on('contests-loaded', function () {
      console.log('admin: contests-loaded');
      $scope.contests = _.filter($scope.contests, { hasEnded: false });
    });
  });
