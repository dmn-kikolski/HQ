(function(){
  'use strict';

  angular
    .module('dashboardModule')
    .controller('createUserController', ['$scope','$state', 'usersService',
      function($scope, $state, usersService){

      $scope.back = function() {
        $state.go('dashboard.users-browse');
      };

      $scope.save = function() {
        usersService.createUser($scope.newUser)
          .success(function(responseData){
            $state.go('dashboard.users-browse');
          })
          .error(function(errorData){
            console.log("ERROR|createUserController|save")
            if (errorData !== null) {
              $scope.errorHeader = errorData.header;
              $scope.errorContent = errorData.content;
              $scope.errorOccurred = true;
            }
          });
      };

  }]);
})();
