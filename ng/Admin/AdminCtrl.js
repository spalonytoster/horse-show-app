angular.module('App.Admin')
  .controller('AdminCtrl', function ($scope) {

    $scope.actions = [{
      label: '#1 Grand Prix Amsterdam',
      template: '',
      isContest: true,
      data: {}
    }, {
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

    $scope.setSelected = function (selected) {
      $scope.selected = selected;
    };
  });
