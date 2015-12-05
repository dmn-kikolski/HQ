(function(){
  'use strict';

  angular
    .module('dashboardModule')
    .controller('createObjectFirstStepController', ['$scope', '$state', 'flashService', 'usersService', 'objectsService', 'workflowsService', 'buildGraphService',
      function($scope, $state, flashService, usersService, objectsService, workflowsService, buildGraphService){

        $scope.workflowTemplates = [];
        $scope.isSecondStepAvailable = false;

        $scope.goToSecondStep = function() {
          var graph = $scope.workflowTemplates[$scope.templateIndex].graph;
          console.log(graph);
          buildGraphService.setNodes(graph.nodes);
          buildGraphService.setEdges(graph.edges);
          $scope.$parent.objectData = {};
          $scope.$parent.objectData.name = $scope.name;
          $scope.$parent.objectData.desc = $scope.desc;
          $state.go('dashboard.object-create-2');
        };

        $scope.back = function() {
          $state.go('dashboard.objects-browse');
        };

        $scope.checkData = function () {
          $scope.isSecondStepAvailable = $scope.name !== undefined && $scope.desc !== undefined && $scope.templateIndex !== undefined;
        };

        (function () {
          if ($scope.workflowTemplates.length === 0) {
            workflowsService.getWorkflowsTemplates()
              .success(function(data){
                console.log('createObjectController| getWorkflowsTemplates');
                console.log(data);
                $scope.workflowTemplates = data;
              })
              .error(function(data) {
                if (data !== null || data !== undefined) {
                  flashService.error(data);
                }
              });
          }
        })();
    }]);

  angular
    .module('dashboardModule')
    .controller('createObjectSecondStepController', ['$scope', '$state', 'ngDialog', 'validateGraphMetadataService', 'buildGraphService', 'flashService', 'objectsService',
      function($scope, $state, ngDialog, validateGraphMetadataService, buildGraphService, flashService, objectsService){
        var openedDialog = null;

        $scope.nodes = buildGraphService.getNodes();
        $scope.edges = buildGraphService.getEdges();

        $scope.goToFirstStep = function() {
          $state.go('dashboard.object-create-1');
        };

        $scope.create = function() {
          var input = {
            graph: buildGraphService.getElements(),
            name: $scope.$parent.objectData.name,
            desc: $scope.$parent.objectData.desc
          };

          $scope.errors = validateGraphMetadataService.validate(buildGraphService.getElements());

          if ($scope.errors.length > 0) {
            if (openedDialog !== null) {
              openedDialog.close();
            }

            openedDialog = ngDialog.open({
              template: 'modules/dashboard-objects/templates/dialogErrors.html',
              scope: $scope
            });

          } else {
            objectsService.createObject(input)
              .success(function(){
                $state.go('dashboard.objects-browse');
              })
              .error(function(data){
                console.log(data);
              });
          }
        };

    }]);
})();
