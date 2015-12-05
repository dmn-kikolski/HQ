(function() {
  angular
  .module('dashboardModule')
  .factory('menuService',['$http','sessionService', 'ACTION',
    function($http, sessionService, ACTION) {

        var cachedMenu = [];

        var get = function (menu, callback) {
          var user = sessionService.get('user');
          $http.get(ACTION.GET_REMOTE +'user/' + user + '/menu/' + menu + '/fetch').success(callback);
        };

        var getMock = function (menu, callback) {
            if (cachedMenu.length > 0) {
              callback(cachedMenu);
            } else {
              $http.get('modules/mock/menu/' + menu + '.json').success(function(response) {
                cachedMenu = response.data;
                callback(cachedMenu);
              });
            }
        }

        return {
          get: getMock
        }
    }]);
})();
