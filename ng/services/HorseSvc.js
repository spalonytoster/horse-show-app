angular.module('App')
  .service('HorseSvc', function ($http) {
    this.getAll = function () {
      return $http.get('/api/horses');
    };
    this.getOne = function (id) {
      return $http.get('/api/horses/' + id);
    };
    this.create = function (person) {
      return $http.post('/api/horses', horse);
    };
    this.update = function (person) {
      return $http.put('/api/horses', horse);
    };
    this.delete = function (name) {
      return $http.delete('/api/horses/' + name);
    };
  });
