(function(){
  angular
  .module('dashboardModule')
  .factory('flashService', ['$rootScope',
    function($rootScope){
        var message = {
          header: null,
          content: null,
          type: 0         // 0 success / 1 info / 2 warning / -1 error
        };

        var error = function(error) {
          message = error;
          message.type = -1;
          _broadcast(message);
        };

        var success = function(success) {
          message = success;
          message.type = 0;
          _broadcast(message);
        };

        var warning = function(warning) {
          message = warning;
          message.type = 2;
          _broadcast(message);
        };

        var info = function(info) {
          message = info;
          message.type = 1;
          _broadcast(message);
        };

        var flush = function() {
          message = {
            header: null,
            content: null,
            type: 0
          };
        };

        var _broadcast = function(m) {
          $rootScope.$broadcast('flash:message', {message: {header: m.header, content: m.content, type: m.type}});
        };

        return {
          error: error,
          success: success,
          warning: warning,
          info: info,
          flush: flush
        }
  }]);
})();
