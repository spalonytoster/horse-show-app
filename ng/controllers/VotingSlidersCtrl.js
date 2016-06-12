angular.module('App')
  .controller('VotingSlidersCtrl', function ($scope) {

    $scope.scores = {
      type: 0,
      neck: 0,
      body: 0,
      legs: 0,
      movement: 0
    };

    $scope.sendScores = function () {

      _.filter($scope.selected.currentVoting.scores, function (score) {
        return refree._id === $scope.currentUser._id;
      })
      .forEach(function (score) {
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

      console.log($scope.selected.currentVoting.scores);
      // Push scores to currentVoting object
      // Array.prototype.push.apply($scope.selected.currentVoting.scores, scores);
    };

  });
