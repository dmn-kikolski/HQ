(function(){
  'use strict';

  angular.module('dashboardModule')
  .factory('tasksService', ['$http', 'sessionService', 'ACTION',
    function($http, sessionService, ACTION){

      var getAll = function() {
        return $http.get(ACTION.GET_TASKS + sessionService.get('userId'));
      };

      var acceptTask = function(task) {
        var data = {};
        data.productId = task.productId;
        data.userId = sessionService.get('userId');
        data.taskId = task.id;
        return $http.post(ACTION.ACCEPT_TASK, data);
      };

      var rejectTask = function(task) {
        var data = {};
        data.productId = task.productId;
        data.userId = sessionService.get('userId');
        data.taskId = task.id;
        return $http.post(ACTION.REJECT_TASK, data);
      };

      return {
        getAll: getAll,
        acceptTask: acceptTask,
        rejectTask: rejectTask
      };
  }]);
})();
