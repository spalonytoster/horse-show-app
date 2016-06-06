angular.module('App')
  .service('PersonSvc', function ($http) {
    this.getAll = function () {
      return $http.get('/api/persons');
    };
    this.getOne = function (id) {
      return $http.get('/api/persons/' + id);
    };
    this.create = function (person) {
      return $http.post('/api/persons', person);
    };
    this.update = function (person) {
      return $http.put('/api/persons', person);
    };
    this.delete = function (name) {
      return $http.delete('/api/persons/' + name);
    };
  });
