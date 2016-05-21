app.config(function ($mdIconProvider, $mdThemingProvider) {
  $mdIconProvider
    .icon("menu", "/svg/menu.svg", 24);

  $mdThemingProvider.theme('default')
                      .primaryPalette('blue')
                      .accentPalette('red');
});
