angular.module('App')
  .service('ContestSvc', function ($http) {
    this.getAll = function () {
      return $http.get('/api/contests');
    };
    this.getOne = function (name) {
      return $http.get('/api/contests/' + name);
    };
    this.create = function (contest) {
      return $http.post('/api/contests', contest);
    };
    this.update = function (contest) {
      return $http.put('/api/contests', contest);
    };
    this.delete = function (name) {
      return $http.delete('/api/contests/' + name);
    };
  });
