app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', { controller: 'ViewerCtrl', templateUrl: 'viewer.html'})
    .when('/admin', { controller: 'AdminCtrl', templateUrl: 'admin.html'})
    .when('/refree', { controller: 'RefreeCtrl', templateUrl: 'refree.html'});
});
