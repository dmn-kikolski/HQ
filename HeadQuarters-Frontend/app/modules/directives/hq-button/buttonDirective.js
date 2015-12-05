(function() {
  'use strict';
    angular.module('dashboardModule').directive("hqButton",  ['authenticationService',
      function(authenticationService){

        var link = function(scope, elements, attributes) {
          scope.isVisible = authenticationService.checkRight(scope.right);
        };

        var controller = function($scope) {
          $scope.fire = function() {
            $scope.action();
          };
        };

        return {
          restrict: 'E',
          replace: true,
          scope: {
            label: '@',
            right: '@',
            icon: '@',
            action: '&'
          },
          templateUrl: 'modules/directives/hq-button/secured-button.html',
          link: link,
          controller: controller
        }
      }]);
})();
