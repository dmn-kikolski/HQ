(function(){
  'use strict';

  angular
    .module('dashboardModule')
    .controller('detailsTaskController', ['$scope', '$state', '$stateParams', 'tasksService', 'usersService', 'objectsService',
      function($scope, $state, $stateParams, tasksService, usersService, objectsService){
        $scope.performers = [];
        $scope.productDetails = {};

        $scope.back = function() {
          $state.go('dashboard.tasks-browse');
        };

        (function(){
          $scope.task = $stateParams.data;

          objectsService.getGeneralInfoById($scope.task.productId).success(function(data){
            $scope.productDetails = data;
            console.log(data);
          });

          for (var i = 0; i < $scope.task.performers.length; i++) {
            usersService.getUserDetails($scope.task.performers[i]).success(function(data){
              console.log('task details performers');
              console.log(data);
              $scope.performers.push(data.firstName + ' ' + data.lastName);
            });
          }
        })();
  }]);
})();
