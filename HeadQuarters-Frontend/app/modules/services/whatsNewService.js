(function(){
  angular.module('enterpageModule').factory('whatsNewService', ['$http',
    function($http){
      return {
        get: function(callback) {
          $http
          .get('modules/config/_releaseNotes.json')
          .success(callback);
        }
      };
  }]);
})();
