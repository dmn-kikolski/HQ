(function(){
  'use strict';

  angular
    .module('dashboardModule')
    .controller('editWorkflowController', ['$scope', '$state', '$stateParams','$rootScope', 'workflowData', 'buildGraphService', 'validateGraphStructureService', 'validateGraphMetadataService', 'workflowsService', 'flashService', 'ngDialog',
      function($scope, $state, $stateParams, $rootScope, workflowData, buildGraphService, validateGraphStructureService, validateGraphMetadataService, workflowsService, flashService, ngDialog){
      var openedDialog = null;
      var savingTemplateStepsNumber = 2;
      $scope.hideBasicData = false;
      $scope.templateName = workflowData.name;
      $scope.templateDesc = workflowData.description;
      $scope.nodes = workflowData.graph.nodes;
      $scope.edges = workflowData.graph.edges;
      $scope.dbId = workflowData.id;
      $scope.creator = workflowData.creator;
      $scope.savingProgress = 0 + "%";
      $scope.validationErrors = null;
      $scope.savingErrorOccured = false;

      $scope.update = function() {
        var input = {};
        input.graph = buildGraphService.getElements();
        input.name = $scope.templateName;
        input.dbId = $scope.dbId;

        openedDialog = ngDialog.open({
          template: 'modules/dashboard-workflows/templates/dialogSaveTemplateProgress.html',
          scope: $scope
        });

        $scope.validationErrors = validateGraphStructureService.validate(buildGraphService.getElements());

        if ($scope.validationErrors.length === 0) {
          calculateTemplateSavingProgress(1);
          if ($scope.validationErrors.length === 0) {
            input.creator = $scope.creator;
            input.description = $scope.templateDesc;
            workflowsService.updateTemplate(input)
              .success(function(successResult) {
                calculateTemplateSavingProgress(3);
                $scope.completed = true;
              })
              .error(function(error) {
                console.log(error);
                if (error !== null || error !== undefined)
                  flashService.error(error);
              });

          } else {
            $scope.savingErrorOccured = true;
            calculateTemplateSavingProgress(2);
          }
        } else {
          $scope.savingErrorOccured = true;
          calculateTemplateSavingProgress(2);
        }
      };

      function calculateTemplateSavingProgress(step) {
        var progress = step / savingTemplateStepsNumber * 100.0;
        $scope.savingProgress = progress + '%';
      }

      $scope.goToWorkflows = function() {
        if (openedDialog !== null) {
          openedDialog.close();
        }
        $state.go('dashboard.workflows-browse');
      };

      $scope.showSaveTemplateErrors = function() {
        if (openedDialog !== null) {
          openedDialog.close();
        }
        openedDialog = ngDialog.open({
            template: 'modules/dashboard-workflows/templates/dialogSaveTemplateErrorDetails.html',
            scope: $scope
        });
      };
  }]);
})();
