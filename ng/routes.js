app.config(function ($routeProvider, $locationProvider) {

  var requireAuthentication = function () {
    return {
      load: ['$q', '$location', function ($q, $location) {
        var isAuthenticated = false;
        var deferred = $q.defer();
        deferred.resolve();
        if (!isAuthenticated) {
          $location.path('/login');
        }
        return deferred.promise;
      }]
    };
  };

  $locationProvider.html5Mode(true);

  $routeProvider
    .when('/', { controller: 'ViewerCtrl', templateUrl: 'viewer.html' })
    .when('/admin', {
      controller: 'AdminCtrl',
      templateUrl: 'admin.html',
      resolve: requireAuthentication()
    })
    .when('/refree', { controller: 'RefreeCtrl', templateUrl: 'refree.html' })
    .when('/login', { controller: 'LoginCtrl', templateUrl: 'login.html' })
    .otherwise('/');
});
