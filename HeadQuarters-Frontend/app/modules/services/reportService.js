(function(){
  'use strict';
  angular.module('dashboardModule')
  .factory('reportService', ['$http', 'sessionService', 'ACTION',
    function($http, sessionService, ACTION){

      var getReportForTasks = function(data) {
        return $http.get(ACTION.GET_REPORT_TASKS, data);
      };

      var getReportForProducts = function(f, d) {
        var data = {};
        data.format = f;
        data.divider = d;
        return $http.post(ACTION.GET_REPORT_PRODUCTS, data);
      };

      var getUndoneTasks = function(f) {
        var data = {'format': f};
        return $http.get(ACTION.GET_REPORT_UNDONE_TASKS, data);
      };

      var getUndoneProducts = function(f, d) {
        var data = {};
        data.format = f;
        data.divider = d;
        return $http.post(ACTION.GET_REPORT_UNDONE_PRODUCTS, data);
      };

      var getFinishedProducts = function(f, d) {
        var data = {};
        data.format = f;
        data.divider = d;
        return $http.post(ACTION.GET_REPORT_FINISHED_PRODUCTS, data);
      };

      var getFinishedTasks = function(f) {
        var data = {'format': f};
        return $http.get(ACTION.GET_REPORT_FINISHED_TASKS, data);
      };

      return {
        getReportForTasks: getReportForTasks,
        getReportForProducts: getReportForProducts,
        getUndoneTasks: getUndoneTasks,
        getUndoneProducts: getUndoneProducts,
        getFinishedProducts: getFinishedProducts,
        getFinishedTasks: getFinishedTasks
      };
  }]);
})();
