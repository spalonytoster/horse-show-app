app.controller('LoginCtrl', function ($scope, LoginSvc) {
  $scope.login = function (user) {
    LoginSvc.login(user.username, user.password, user.rememberMe)
      .then(function (response) {
        console.log('logged in');
        console.log(response.data);
        $scope.$emit('login', response.data);
        
      });
  };
});
