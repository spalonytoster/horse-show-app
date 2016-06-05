var http = null;

app.config(function ($routeProvider, $locationProvider) {

  var requireAuthentication = function (role) {
    return {
      load: ['$q', '$location', function ($q, $location) {
        var deferred = $q.defer();
        deferred.resolve();

        http.get('/api/persons/user')
        .success(function (data) {
          if (data.role !== role) {
            $location.path('/login');
          }
        })
        .error(function () {
          $location.path('/login');
        });
        return deferred.promise;
      }]
    };
  };

  $locationProvider.html5Mode(true);

  $routeProvider
    .when('/', { controller: 'ViewerCtrl', templateUrl: 'viewer.html' })
    .when('/admin', {
      controller: 'AdminCtrl',
      templateUrl: 'admin/admin.html',
      resolve: requireAuthentication('admin')
    })
    .when('/refree', {
       controller: 'RefreeCtrl',
       templateUrl: 'refree/admin.html',
       resolve: requireAuthentication('refree')
     })
    .when('/login', { controller: 'LoginCtrl', templateUrl: 'login.html' })
    .otherwise('/');
});

app.run(function ($http) {
  http = $http;
});
