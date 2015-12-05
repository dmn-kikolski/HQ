(function(){
  'use strict';

  angular
    .module('dashboardModule')
    .controller('userProfileController', ['$scope', 'usersService', 'flashService',
      function($scope, usersService, flashService){
        $scope.isEditMode = false;
        $scope.profile = {}

        $scope.edit = function() {
          $scope.isEditMode = true;
        };

        $scope.saveUserDetails = function() {
          console.dir($scope.updatedProfile)
          usersService.editUser($scope.updatedProfile)
            .success(function() {
              $scope.isEditMode = false;
              $scope.profile = cloneProfileData($scope.updatedProfile);
            })
            .error(function(errorData){
              console.log('error');
            });
        };

        $scope.cancelPasswordChange = function() {
          $scope.isEditMode = false;
          $scope.changePassword.current = null;
          $scope.changePassword.new = null;
          $scope.changePassword.newRepeated = null;
        };

        $scope.savePasswordChange = function() {
          $scope.changePassword.id = $scope.profile.id
          ;
          console.dir($scope.changePassword);
          usersService.editUserPassword($scope.changePassword)
            .success(function() {
              console.log('ok');
              $scope.isEditMode = false;
              var message = {};
              message.header = 'Success. Password has been changed.';
              flashService.success(message);
            })
            .error(function(errorData){
              console.log('error');
              console.log(errorData);
            });
        };

        $scope.cancel = function() {
          $scope.updatedProfile = $scope.profile;
          $scope.isEditMode = false;
        };

        function cloneProfileData(data) {
          return {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            mobilePhone: data.mobilePhone,
            email: data.email,
            id: data.id
          };
        }

        (function() {
          usersService.getLoggedUserDetails()
            .success(function(data){
              console.log('userProfileController | init | DATA: %s', data);
              $scope.profile = cloneProfileData(data);
              $scope.updatedProfile = cloneProfileData(data);
            });
        })();
  }]);
})();
