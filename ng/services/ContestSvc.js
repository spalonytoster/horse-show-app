angular.module('App')
  .service('ContestSvc', function ($http) {
    this.getAll = function () {
      return $http.get('/api/contests');
    };
    this.getOne = function (nameFormatted) {
      return $http.get('/api/contests/' + nameFormatted);
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
