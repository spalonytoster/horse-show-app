app.service('TournamentSvc', function ($http) {
  this.getTournaments = function () {
    return $http.get('/api/tournaments');
  };
});
