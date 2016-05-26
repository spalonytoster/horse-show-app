app.controller('ViewerCtrl', function ($scope, $mdSidenav, ContestsSvc) {
  ContestsSvc.getAll().success(function (contests) {
    $scope.contests = contests;
    $scope.selected = $scope.contests[0];
  });

  $scope.setSelected = function (contest) {
    $scope.selected = contest;
  };

  $scope.toggleSidebar = function () {
    $mdSidenav('sidebar').toggle();
  };

  $scope.scoreTable = {
    headers: [
      {
        name:'',
        field:'thumb'
      },{
        name: 'Name',
        field: 'name'
      },{
        name:'Description',
        field: 'description'
      },{
        name: 'Last Modified',
        field: 'last_modified'
      }
    ],
    content: [
      {
        thumb:'https://lh3.googleusercontent.com/-5NfcdlvGQhs/AAAAAAAAAAI/AAAAAAAAABY/ibGrApGYTuQ/photo.jpg',
        name: 'Bruno Mars',
        description: 'Human',
        last_modified: 'Jun 5, 2014'
      },{
        thumb:'http://www.otakia.com/wp-content/uploads/V_1/article_3573/7405.jpg',
        name: 'AT-AT',
        description: 'Robot',
        last_modified: 'Jun 5, 2014'
      },{
        thumb:'https://speakerdata.s3.amazonaws.com/photo/image/774492/Mark-Ronson-r24.jpg',
        name: 'Mark Ronson',
        description: 'Human',
        last_modified: 'Jun 5, 2014'
      },{
        thumb:'http://25.media.tumblr.com/61ebf04c3cc7a84944aa0246e902f2a7/tumblr_mm35b87dGz1qmwrnuo1_1280.jpg',
        name: 'Daft Punk',
        description: 'Human-Robot',
        last_modified: 'Jun 5, 2014'
      },{
        thumb:'http://thatgrapejuice.net/wp-content/uploads/2014/03/lady-gaga-that-grape-juice-televisionjpg.jpg',
        name: 'Lady Gaga',
        description: 'Undefined',
        last_modified: 'Jun 5, 2014'
      }
    ],
    sortable: ['name', 'description', 'last_modified']
  };

});
