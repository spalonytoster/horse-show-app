app.service('LoginSvc', function ($http) {

  var svc = this;

  svc.getUser = function () {
    return $http.get('/api/persons/user');
  };

  svc.login = function (username, password, rememberMe) {
    return $http.post('/api/sessions', {
      username: username,
      password: password
    })
    .then(function (val) {
      if (rememberMe) {
        console.log('rememberMe - userSvc');
        window.localStorage.token = val.data;
        console.log('token from localStorage: ' + window.localStorage.token);
      }
      $http.defaults.headers.common['X-auth'] = val.data;
      return svc.getUser();
    });
  };

  svc.logout = function () {
    delete $http.defaults.headers.common['X-auth'];
  };

  svc.createUser = function (username, password) {
    return $http.post('/api/persons', {
      username: username,
      password: password
    });
  };
  
});
