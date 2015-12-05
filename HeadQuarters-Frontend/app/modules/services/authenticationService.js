'use strict';

(function() {
  angular
  .module('securityModule')
  .factory('authenticationService',['$http', '$sanitize', 'sessionService','ACTION',
    function($http, $sanitize, sessionService, ACTION){

      var loginHandler = function(credentials) {
        var response = $http.post(ACTION.LOGIN, sanitizeCredentials(credentials));
        response.success(cacheToken);
        response.success(cacheUser);
        return response;
      };

      var logoutHandler = function() {
        var data = {};
        data.userId = sessionService.get('userId');
        data.securityToken = sessionService.getSessionToken();
        return $http.post(ACTION.LOGOUT, data);
      };

      var cacheToken = function(data) {
        sessionService.put('authenticated', true);
        sessionService.putSessionToken(data.token);
      };

      var cacheUser = function(data) {
        sessionService.put('userEmail', data.user.email);
        sessionService.put('userId', data.user.id);
      };

      var invalidateSession = function() {
        sessionService.remove('authenticated');
        sessionService.remove('userEmail');
        sessionService.remove('userId');
      };

      var sanitizeCredentials = function(credentials) {
          return {
            username: $sanitize(credentials.username),
            password: $sanitize(credentials.password)
          };
      };

      var checkRight = function(right) {
        // for testing
        return true;
      };

      return {
        login: loginHandler,
        checkRight: checkRight
      };
  }]);

  angular.module('securityModule').run(function($rootScope, $http, $location, sessionService, SECURED){
    $rootScope.$on('$locationChangeStart', function(event, next) {
      for (var i = 0; i < SECURED.ROUTES.length; i++) {
        if (next.indexOf(SECURED.ROUTES[i]) !== -1 && sessionService.get('authenticated') === null) {
          $location.path('/login');
        }
      }
    });
  });
})();
