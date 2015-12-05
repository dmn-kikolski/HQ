(function(){
  'use strict';
  angular.module('dashboardModule').controller('dashboardCoreController', ['$scope','$state',
    function($scope, $state){

      $scope.unselected = true;

      $scope.$on('dashboard-change-state', function(event, args) {
        $state.go(args.state);
      });

      $scope.changeState = function(state) {
        $state.go(state);
        $scope.unselected = false;
      };

      $scope.justLogged = function() {
        return $state.current.name === 'dashboard' && $scope.unselected;
      };
  }]);

  angular.module('dashboardModule').controller('logoutController', ['$scope','$state','sessionService', '$http', 'ACTION',
    function($scope, $state, sessionService, $http, ACTION){
      $scope.yes = function() {
        var data = {};
        data.userId = sessionService.get('userId');
        data.securityToken = sessionService.get('sessionToken');
        $http.post(ACTION.LOGOUT, data);
        sessionService.purge();
        $state.go('enterpage.login');
      };

      $scope.no = function() {
        $state.go('dashboard');
      };
  }]);
})();
