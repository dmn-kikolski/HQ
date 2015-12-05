(function(){
  'use strict';

  angular
    .module('dashboardModule')
    .controller('detailsWorkflowController', ['$scope', '$state', '$stateParams','$rootScope', 'workflowData',
      function($scope, $state, $stateParams, $rootScope, workflowData){
      $scope.hideBasicData = false;
      $scope.templateName = workflowData.name;
      $scope.templateDesc = workflowData.description;
      $scope.nodes = workflowData.graph.nodes;
      $scope.edges = workflowData.graph.edges;
      $scope.dbId = workflowData.id;
      $scope.creator = workflowData.creator;

      $scope.back = function() {
        $state.go('dashboard.workflows-browse');
      };
  }]);
})();
