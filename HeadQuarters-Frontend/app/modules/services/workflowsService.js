(function() {
  'use strict';
  angular.module('dashboardModule')
  .factory('workflowsService',['$http', 'sessionService', 'ACTION',
    function($http, sessionService, ACTION){

      var saveAsWorkingCopy = function(data) {
        data.userId = sessionService.get('userID');
        data.isWorkingCopy = true;
        data.isTemplate = false;
        return $http.post(ACTION.WORKFLOW_SAVE_WORKING_COPY, data);
      };

      var saveAsTemplate = function(data) {
        var input = {};
        input.graph = data.graph;
        input.name = data.name;
        input.description = data.desc;
        input.userId = sessionService.get('userId');
        input.isTemplate = true;
        return $http.post(ACTION.WORKFLOW_SAVE_TEMPLATE, input);
      };

      var updateTemplate = function(data) {
        var input = {};
        input.id = data.dbId;
        input.graph = data.graph;
        input.name = data.name;
        input.creator = data.creator;
        input.description = data.description;
        input.userId = sessionService.get('userId');
        input.isTemplate = true;
        return $http.post(ACTION.WORKFLOW_UPDATE, input);
      };

      var getWorkflowsTemplates = function() {
        return $http.get(ACTION.GET_WORKFLOWS_TEMPLATES);
      };

      var getAll = function() {
        return $http.get(ACTION.GET_WORKFLOWS);
      };

      var getById = function(id) {
        return $http.get(ACTION.GET_WORKFLOW + id);
      };

      var deleteById = function(id) {
        return $http.post(ACTION.DELETE_WORKFLOW, {id: id});
      };

      return {
        saveAsWorkingCopy: saveAsWorkingCopy,
        saveAsTemplate: saveAsTemplate,
        getWorkflowsTemplates: getWorkflowsTemplates,
        getById: getById,
        updateTemplate: updateTemplate,
        deleteById: deleteById,
        getAll: getAll
      };
  }]);
})();
