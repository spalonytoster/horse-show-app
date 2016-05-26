(function () {
  var app = angular.module('viewTable', ['ngMaterial']);

  app.directive('viewTable', function () {
    return {
      restrict: 'E',
      templateUrl: 'view-table.html',
      scope: {
        name: '=',
        data: '='
      },
      controller: function ($scope) {
        $scope.headers = $scope.data.headers;
        $scope.content = $scope.data.content;
        $scope.sortable = $scope.data.sortable;
      }
    };
  });

  app.directive('mdTable', function () {
    return {
      restrict: 'E',
      scope: {
        headers: '=',
        content: '=',
        sortable: '=',
        filters: '=',
        customClass: '=customClass',
        thumbs:'=',
        count: '=',
        name: '='
      },
      controller: function ($scope,$filter,$window) {
        $scope.toggleSearch = false;
        $scope.custom = {name: 'bold', description:'grey',last_modified: 'grey'};
        $scope.thumbs = 'thumb';
        $scope.count = 10;

        var orderBy = $filter('orderBy');
        $scope.tablePage = 0;
        $scope.nbOfPages = function () {
          return Math.ceil($scope.content.length / $scope.count);
        };
        $scope.handleSort = function (field) {
          if ($scope.sortable.indexOf(field) > -1) { return true; } else { return false; }
        };
        $scope.order = function(predicate, reverse) {
          $scope.content = orderBy($scope.content, predicate, reverse);
          $scope.predicate = predicate;
        };
        $scope.order($scope.sortable[0],false);
        $scope.getNumber = function (num) {
          return new Array(num);
        };
        $scope.goToPage = function (page) {
          $scope.tablePage = page;
        };
      },
      template: angular.element(document.querySelector('#md-table-template')).html()
    };
  });

  app.filter('startFrom',function (){
    return function (input,start) {
      start = +start;
      return input.slice(start);
    };
  });
})();
