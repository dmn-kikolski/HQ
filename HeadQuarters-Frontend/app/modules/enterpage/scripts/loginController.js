(function(){
  'use strict';
  angular
  .module('enterpageModule')
  .controller('loginController',['$scope','$state','authenticationService',
    function($scope, $state, authenticationService){

      $scope.login = function() {
        authenticationService.login($scope.credentials)
          .success(function(){
            $state.go('dashboard');
          })
          .error(function(errorData) {
            $scope.errorHeader = 'Authorization Error';
            $scope.errorContent = 'Incorrect e-mail or password';
            $scope.errorOccurred = true;
          });
      };
  }]);
})();
