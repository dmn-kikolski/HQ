'use strict';

(function() {
  angular
  .module('dashboardModule')
  .factory('objectsService',['$http', 'sessionService', 'ACTION',
    function($http, sessionService, ACTION){

      var getObjects = function() {
        return $http.get(ACTION.GET_OBJECTS);
      };

      var createObject = function(data) {
        data.creator = sessionService.get('userEmail');
        return $http.post(ACTION.OBJECT_CREATE, data);
      };

      var runProccess = function(id) {
        var data = {};
        data.id = id;
        return $http.post(ACTION.PROCESS_OBJECT, data);
      };

      var getGeneralInfoById = function(id) {
        return $http.get(ACTION.GET_OBJECTS_BASIC + id);
      };

      return {
        getObjects: getObjects,
        createObject: createObject,
        runProccess: runProccess,
        getGeneralInfoById: getGeneralInfoById
      };
  }]);
})();
