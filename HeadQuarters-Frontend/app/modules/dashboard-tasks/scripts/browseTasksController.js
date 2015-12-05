(function(){
  'use strict';

  angular
    .module('dashboardModule')
    .controller('browseTasksController', ['$scope', '$state', 'tasksService', 'usersService', 'sessionService',
      function($scope, $state, tasksService, usersService, sessionService){

        $scope.tasks = [];

        $scope.dataExists = function () {
          return $scope.tasks.length !== 0;
        };

        $scope.resetFilters = function() {
          $scope.isDone = undefined;
        };

        $scope.details = function(index) {
          var task = $scope.tasks[index];
          $state.go('dashboard.task-details', {data: task});
        };

        $scope.isAssignedToMe = function(index) {
          var result = $scope.tasks[index].performers.indexOf(sessionService.get('userId'));
          return result !== -1;
        };

        $scope.isMarkedByMe = function(index) {
          var acceptedIndex = -1;
          var rejectedIndex = -1;

          if ($scope.tasks[index].acceptedBy !== undefined) {
            acceptedIndex = $scope.tasks[index].acceptedBy.indexOf(sessionService.get('userId'));
          }
          if ($scope.tasks[index].rejectedBy !== undefined) {
            rejectedIndex = $scope.tasks[index].rejectedBy.indexOf(sessionService.get('userId'));
          }
          return acceptedIndex !== -1 || rejectedIndex !== -1;
        };

        $scope.showActionButtons = function(index) {
          return $scope.isAssignedToMe(index) && !$scope.isMarkedByMe(index);
        };

        $scope.accept = function(index) {
          var task = $scope.tasks[index];
          tasksService.acceptTask(task).success(function(){
            $state.go($state.current, {}, {reload: true});
          });
        };

        $scope.reject = function(index) {
          var task = $scope.tasks[index];
          tasksService.rejectTask(task).success(function(){
            $state.go($state.current, {}, {reload: true});
          });
        };

        (function(){
          tasksService.getAll()
          .success(function(tasks){
            console.log('tasks');
            console.log(tasks);
            for (var i = 0; i < tasks.length; i++) {
              $scope.tasks[i] = {};
              $scope.tasks[i].summary = tasks[i].data.metadata.summary;
              $scope.tasks[i].performers = tasks[i].data.metadata.performers;
              $scope.tasks[i].acceptedBy = tasks[i].data.metadata.acceptedBy;
              $scope.tasks[i].rejectedBy = tasks[i].data.metadata.rejectedBy;
              $scope.tasks[i].description = tasks[i].data.metadata.description;
              $scope.tasks[i].isDone = tasks[i].data.metadata.state === 'done';
              $scope.tasks[i].productId = tasks[i].productId;
              $scope.tasks[i].id = tasks[i].data.id;
              console.log($scope.tasks[i]);
            }
          })
          .error(function(data){
            console.log(data);
          });
        })();
  }]);
})();
