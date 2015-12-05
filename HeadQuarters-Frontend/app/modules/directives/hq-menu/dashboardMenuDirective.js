(function() {
  'use strict';
    angular.module('dashboardModule').directive("hqVerticalMenu",  ['menuService', '$state', '$rootScope',
      function(menuService, $state, $rootScope){

        var link = function(scope, elements, attributes) {
          menuService.get(scope.hqName, function(data) {
            scope.menu = data;
          });
        }

        var controller = function($scope) {
          $scope.menuSelect = function(item) {
            $scope.selectedItem = item;
            if (hasState(item)) {
              $scope.hqSelect()(item.state);
            }
          }
        }

        function hasState(item) {
          return item.state != undefined && item.state.length > 0;
        }

        return {
          restrict: 'E',
          templateUrl: 'modules/directives/hq-menu/vertical-menu.html',
          replace: true,
          scope: {
            hqName: '@',
            hqSelect: '&'
          },
          link: link,
          controller: controller
        }
      }]);
})();
