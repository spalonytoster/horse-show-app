angular.module('App.Admin')
  .controller('CreateContestCtrl', function($scope, ContestSvc) {

    $scope.tabIndex = 0;
    $scope.startingList = [];
    $scope.chosenRefrees = [];
    $scope.getGroups = {};
    $scope.getContestInfo = {};

    $scope.tabs = [{
      label: 'contest info',
      template: 'admin/create-contest/contest-info.html',
      disabled: false
    }, {
      label: 'contestants',
      template: 'admin/create-contest/contestants.html',
      disabled: true
    }, {
      label: 'refrees',
      template: 'admin/create-contest/refrees.html',
      disabled: true
    }, {
      label: 'groups',
      template: 'admin/create-contest/groups.html',
      disabled: true
    }];

    $scope.next = function() {
      var tabIndex = Math.min($scope.tabIndex + 1, 3);
      // console.log(tabIndex);
      $scope.tabs[tabIndex].disabled = false;
      $scope.tabIndex = tabIndex;
    };

    $scope.previous = function() {
      var tabIndex = Math.max($scope.tabIndex - 1, 0);
      // console.log(tabIndex);
      $scope.tabIndex = tabIndex;
    };

    $scope.isLastTab = function () {
      return $scope.tabIndex === $scope.tabs.length-1;
    };

    $scope.finish = function () {
      $scope.contest = $scope.getContestInfo.get();
      $scope.contest.groups = $scope.getGroups.get();

      $scope.contest.groups.forEach(function (elt, i, array) {
        var counter = 1;
        array[i].contestants = _.map(array[i].contestants, function (horse) {
          return {
            horse: horse._id,
            number: counter++
          };
        });

        array[i].refrees = _.map(array[i].refrees, function (refree) {
          return refree._id;
        });
      });

      console.log($scope.contest);

      ContestSvc.create($scope.contest)
        .success(function (contest) {
          console.log(contest);
        });
    };

  });
