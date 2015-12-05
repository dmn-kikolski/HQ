(function(){
  'use strict';

  angular
    .module('dashboardModule')
    .controller('detailsObjectController', ['$scope', '$state', '$rootScope','usersService', 'productData',
      function($scope, $state, $rootScope, usersService, productData){
        $scope.product = productData;
        $scope.nodes = productData.graph.nodes;
        $scope.edges = productData.graph.edges;

        console.log('product data');
        console.log(productData);

        $scope.back = function() {
          $state.go('dashboard.objects-browse');
        };

        $scope.hide = function() {
          $scope.hideDetails = !$scope.hideDetails;
        };
  }]);
})();
