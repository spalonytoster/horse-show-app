angular.module('App')
  .controller('VotingSlidersCtrl', function ($scope, socketio) {

    $scope.scores = {
      type: 0,
      neck: 0,
      body: 0,
      legs: 0,
      movement: 0
    };

    $scope.$on('contest-loaded', function () {
      _.filter($scope.selected.currentVoting.scores, function (score) {
        return score.refree === $scope.currentUser._id;
      })
      .forEach(function (score) {
        switch (score.scoreType) {
          case 'type': $scope.scores.type = score.value;
            break;
          case 'neck': $scope.scores.neck = score.value;
            break;
          case 'body': $scope.scores.body = score.value;
            break;
          case 'legs': $scope.scores.legs = score.value;
            break;
          case 'movement': $scope.scores.movement = score.value;
            break;
          default:
        }
      });
    });

    $scope.$on('next-contestant', function () {
      $scope.scoresSubmitted = false;
      $scope.scores = {
        type: 0,
        neck: 0,
        body: 0,
        legs: 0,
        movement: 0
      };
    });

    $scope.sendScores = function () {
      var scores = _.filter($scope.selected.currentVoting.scores, function (score) {
        return score.refree === $scope.currentUser._id;
      });

      scores.forEach(function (score) {
        switch (score.scoreType) {
          case 'type': score.value = $scope.scores.type;
            break;
          case 'neck': score.value = $scope.scores.neck;
            break;
          case 'body': score.value = $scope.scores.body;
            break;
          case 'legs': score.value = $scope.scores.legs;
            break;
          case 'movement': score.value = $scope.scores.movement;
            break;
          default:
        }
      });

      socketio.emit('main:updateScores', { _id: $scope.selected._id, scores: $scope.scores });
      console.log($scope.scores);
    };

    $scope.finalizeScores = function () {
      console.log('finalizeScores');
      // $scope.updateContest($scope.selected.nameFormatted, function (contest) {
        // Array.prototype.push.apply(contest.groups[$scope.selected.currentVoting.group].contestants[$scope.selected.currentVoting.contestant.index].scores, $scope.scores);
      // });
      $scope.scoresSubmitted = true;
      socketio.emit('main:broadcastRefreeScores', { _id: $scope.selected._id, scores: $scope.selected.currentVoting.scores });
    };

  });
