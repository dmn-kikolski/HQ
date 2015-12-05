(function(){
  'use strict';

  angular
    .module('dashboardModule')
    .controller('userDetailsController', ['$scope', '$state', '$stateParams', 'usersService',
      function($scope, $state, $stateParams, usersService){
        if ($stateParams.id === undefined || $stateParams.id === null)
          $state.go('dashboard.users-browse');

        var getDetails = function() {
          usersService.getUserDetails($stateParams.id)
            .success(function(data){
              $scope.userDetails = data;
            })
            .error(function(errorData){
              console.log("Error:userDetailsController:getDetails");
            });
        }

        $scope.back = function() {
          $state.go('dashboard.users-browse');
        };

        getDetails();
    }]);
})();
