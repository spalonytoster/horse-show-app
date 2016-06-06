(function() {
  angular.module('App', [
    'ngRoute',
    'ngMaterial',
    'md.data.table',
    'btford.socket-io',
    'App.Admin'
  ])

  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('green')
      .warnPalette('red');
  })

  .factory('mySocket', function (socketFactory) {
    return socketFactory();
  });

}());
