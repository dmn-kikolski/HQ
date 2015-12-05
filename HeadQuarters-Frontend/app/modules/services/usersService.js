'use strict';
(function() {
  angular
  .module('dashboardModule')
  .factory('usersService',['$http', 'sessionService', 'flashService', 'ACTION',
    function($http, sessionService, flashService, ACTION){

      var getUsers = function() {
        return $http.get(ACTION.GET_USERS);
      };

      var getUserDetails = function(userId) {
        return $http.get(ACTION.GET_USER_DETAILS + userId);
      };

      var getLoggedUserDetails = function() {
        return $http.post(ACTION.PROFILE, {email : sessionService.get('userEmail')});
      };

      var createUser = function(newUser) {
        var data = {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email
        };

        return $http.post(ACTION.CREATE_USER, data);
      };

      var removeUser = function(id) {
        return $http.post(ACTION.REMOVE_USER, {id: id});
      };

      var editUser = function(data) {
        var profile = {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            mobilePhone: data.mobilePhone,
            email: data.email,
            id: data.id
        };

        return $http.post(ACTION.EDIT_USER, profile);
      };

      var editUserPassword = function(data) {
        data.userId = sessionService.get('userId');
        return $http.post(ACTION.EDIT_USER_PASSWORD, data);
      };

      return {
        getUsers: getUsers,
        getUserDetails: getUserDetails,
        getLoggedUserDetails: getLoggedUserDetails,
        createUser: createUser,
        removeUser: removeUser,
        editUser: editUser,
        editUserPassword: editUserPassword
      };
  }]);
})();
