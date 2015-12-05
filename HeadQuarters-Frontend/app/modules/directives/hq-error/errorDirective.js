(function() {
  'use strict';
    angular.module('headquartersApp').directive("hqError",  [
      function(){
        return {
          restrict: 'E',
          replace: true,
          scope: {
            header: '=',
            content: '=',
            isVisible: '='
          },
          templateUrl: 'modules/directives/hq-error/error.html'
        }
      }]);
})();
