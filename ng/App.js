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

  .factory('socketio', function (socketFactory) {
    var token, socket;
    token = typeof window.localStorage.token === 'string' ? window.localStorage.token : '';
    socket = io.connect('/main', { query: "token=" + token });
    return socketFactory({ ioSocket: socket });
  });

}());
