angular.module('App')
  .controller('LoginCtrl', function ($scope, LoginSvc, $location) {
    $scope.login = function (user) {
      LoginSvc.login(user.username, user.password, user.rememberMe)
        .then(function (response) {
          console.log('logged in');
          console.log(response.data);
          $scope.$emit('login', response.data);
          $location.path('/' + response.data.role);
        });
    };
  });
