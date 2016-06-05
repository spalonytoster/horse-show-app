angular.module('App')
  .service('RefreeSvc', function ($http) {
    this.getAll = function () {
      return $http.get('/api/persons/refrees');
    };
  });
