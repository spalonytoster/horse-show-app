(function() {
  var app = angular.module('App', [
    'ngRoute',
    'ngMaterial',
    'md.data.table',
    'App.Admin'
  ]);

  app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('green')
      .warnPalette('red');
  });

}());
