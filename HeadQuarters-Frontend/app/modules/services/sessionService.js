'use strict';
(function(){
  angular
  .module('securityModule')
  .factory('sessionService', [
    function(){
      return {
        put: function(key, val) {
          sessionStorage.setItem(key, val);
        },
        remove: function(key) {
          sessionStorage.removeItem(key);
        },
        get: function(key) {
          return sessionStorage.getItem(key);
        },
        isAuthenticated: function() {
          var authenticated = sessionStorage.getItem('authenticated');
          return authenticated !== null;
        },
        putSessionToken: function(token) {
          sessionStorage.setItem('sessionToken', token);
        },
        getSessionToken: function() {
          return sessionStorage.getItem('sessionToken');
        },
        purge: function() {
          sessionStorage.removeItem('userId');
          sessionStorage.removeItem('authenticated');
          sessionStorage.removeItem('sessionToken');
        }
      };
  }]);
})();
