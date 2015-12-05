'use strict';

(function() {
  angular.module('enterpageModule').factory('sessionTokenInjector', ['sessionService', function (sessionService) {
    var sessionInjector = {
      requst: function(config) {
        if (sessionService.isAuthenticated()) {
          config.headers['x-session-token'] = sessionService.getSessionToken();
          console.log('session token %s', sessionService.getSessionToken());
        }
        return config;
      }
    };
    return sessionInjector;
  }]);
})();
