var app = angular.module('app', [
  'ngRoute',
  'ngMaterial',
  'md.data.table'
]);

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('pink')
    .accentPalette('orange');
});
