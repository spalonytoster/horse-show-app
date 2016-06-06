angular.module('App')
  .controller('ApplicationCtrl', function ($scope, $mdSidenav, $http, $location, LoginSvc, ContestSvc) {
    $scope.toggleSidebar = function () {
      $mdSidenav('sidebar').toggle();
    };

    $scope.$on('login', function (_, user) {
      $scope.currentUser = user;
    });

    $scope.logout = function () {
      LoginSvc.logout();
      delete $scope.currentUser;
      delete window.localStorage.token;
      $location.path('/login');
    };

    if (window.localStorage.token) {
      // console.log('token from localStorage: ' + window.localStorage.token);
      $http.defaults.headers.common['X-auth'] = window.localStorage.token;
      LoginSvc.getUser()
      .success(function (response) {
        // console.log('current user vvv');
        // console.log(response);
        $scope.currentUser = response;
      });
    }

    $scope.getMomentDate = function (date) {
      return moment(date).calendar();
    };

    $scope.getAverageScore = function (scores) {
      var avgScore = 0;
      scores.forEach(function (score) {
        avgScore += score.value;
      });
      avgScore /= scores.length;
      return avgScore;
    };

    $scope.setSelected = function (contest) {
      console.log("HALO");
      ContestSvc.getOne(contest.nameFormatted)
      .success(function (data) {
        $scope.selected = data;
        $scope.selectedGroupInput = data.groups[0].name;
        $scope.changeGroup($scope.selectedGroupInput);
        console.log($scope.selected);
      });
    };

    $scope.changeGroup = function (groupName) {
      $scope.selected.groups.forEach(function (group) {
        if (group.name === groupName) {
          console.log('group changed to ' + group.name);
          $scope.selectedGroup = group;
        }
      });
    };

  });
