(function() {
  'use strict';
    angular.module('headquartersApp').directive("hqFlash", ['flashService', '$rootScope',
      function(flashService, $rootScope){

        var link = function(scope, element, attr) {
          $rootScope.$on('flash:message', function(event, args){
            var message = args.message;
            if (message.header !== undefined || content !== undefined) {
              scope.message = message;
              scope.isVisible = true;
              scope.$apply();
            }
          });
        };

        var controller = function($scope) {
          $scope.close = function() {
            $scope.isVisible = false;
            flashService.flush();
          };
        };

        return {
          restrict: 'E',
          replace: true,
          templateUrl: 'modules/directives/hq-flash/flash.html',
          scope: { },
          link: link,
          controller: controller
        }
      }]);
})();
