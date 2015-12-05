(function(){
  'use strict';

  angular
    .module('dashboardModule')
    .controller('browseUsersController', ['$scope', '$state', 'usersService', 'flashService',
      function($scope, $state, usersService, flashService){

        $scope.users = [];

        $scope.create = function() {
          $state.go('dashboard.user-create');
        };

        $scope.edit = function(user) {
          $state.go('dashboard.user-edit', {id: user._id});
        };

        $scope.details = function(user) {
          console.log('details ' + user);
          $state.go('dashboard.user-details', {id: user._id});
        };

        $scope.delete = function(data) {
          usersService.removeUser(data.id)
            .success(function(){
              $state.go($state.current, {}, {reload: true});
            })
            .error(function(error){
              flashService.error(error);
            });
        };

        (function() {
          usersService.getUsers().success(function(data){
            $scope.users = data;
          });
        })();
  }]);
})();
