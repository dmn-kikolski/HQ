(function(){
  'use strict';

  angular
    .module('dashboardModule')
    .controller('createWorkflowController', ['$scope', '$state', '$rootScope', 'buildGraphService', 'validateGraphStructureService', 'validateGraphMetadataService', 'workflowsService', 'flashService', 'ngDialog',
      function($scope, $state, $rootScope, buildGraphService, validateGraphStructureService, validateGraphMetadataService, workflowsService, flashService, ngDialog){
        var openedDialog = null;
        var savingTemplateStepsNumber = 2; // graph structure validation, graph metadata validation, saving in backend

        $scope.hideBasicData = false;
        $scope.savingProgress = 0 + "%";
        $scope.validationErrors = null;
        $scope.savingErrorOccured = false;
        $scope.completed = false;

        $scope.goToWorkflows = function() {
          if (openedDialog !== null)
            openedDialog.close();
          $state.go('dashboard.workflows-browse');
        }

        $scope.hide = function() {
          $scope.hideBasicData = !$scope.hideBasicData;
        };

        $scope.saveAsTemplate = function() {
          $scope.savingErrorOccured = false;

          if (openedDialog !== null)
            openedDialog.close();

          openedDialog = ngDialog.open({
            template: 'modules/dashboard-workflows/templates/dialogSaveTemplateProgress.html',
            scope: $scope
          });

          // Commentent for testing purposes
          $scope.validationErrors = validateGraphStructureService.validate(buildGraphService.getElements());

          if ($scope.validationErrors.length === 0) {
            calculateTemplateSavingProgress(1);
            // commented for testing puproses TODO UNCOMENT!
            // $scope.validationErrors = validateGraphMetadataService.validate(buildGraphService.getElements());
            if ($scope.validationErrors.length === 0) {
              var webserviceInput = {};
              webserviceInput.graph = buildGraphService.getElements();
              webserviceInput.name = $scope.templateName;
              webserviceInput.desc = $scope.templateDesc;
              workflowsService.saveAsTemplate(webserviceInput)
                .success(function(successResult) {
                  calculateTemplateSavingProgress(3);
                  $scope.completed = true;
                })
                .error(function(error) {
                  console.log("error");
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

        $scope.showSaveTemplateErrors = function() {
          if (openedDialog !== null)
            openedDialog.close();

          openedDialog = ngDialog.open({
              template: 'modules/dashboard-workflows/templates/dialogSaveTemplateErrorDetails.html',
              scope: $scope
          });
        };

        $scope.saveAsWorkingCopy = function() {
          var data = {
            name: $scope.templateName,
            desc: $scope.templateDesc,
            isTemplate: false,
            isWorkingCopy: true,
            graph: buildGraphService.getElements()
          }

          workflowsService.saveAsWorkingCopy(data)
            .success(function(message){
              flashService.success(message);
              openedDialog.close();
            })
            .error(function(message){
              flashService.error(message);
              openedDialog.close();
            });
        }

        $scope.downloadAsPNG = function() {
          buildGraphService.downloadAsPng();
        };

        $scope.getGraphAsJson = function() {
          return JSON.stringify(buildGraphService.getElements());
        };

        $scope.download = function() {
          ngDialog.open({
              template: 'modules/dashboard-workflows/templates/dialogDownload.html',
              scope: $scope
            });
        };

        $scope.save = function() {
          openedDialog = ngDialog.open({
              template: 'modules/dashboard-workflows/templates/dialogSave.html',
              scope: $scope
            });
        };

        $scope.downloadAsJSON = function() {
          ngDialog.open({
              template: 'modules/dashboard-workflows/templates/dialogDownloadAsJson.html',
              scope: $scope
            });
        };

        function calculateTemplateSavingProgress(step) {
          var progress = step / savingTemplateStepsNumber * 100.0;
          $scope.savingProgress = progress + "%";
        }

      $scope.nodesData = [
        { group: "nodes",
          data: {
            id: "start", backgroundColor: '#69d200', outlineColor: '#4c7424', fontColor: '#ffffff', width: '50', height:'50', shape: 'ellipse', type: 'start',
            metadata: {summary: 'start', editable: 'false', state: 'undone'}
          },
          position: { x: 0, y: -300 }},
        { group: "nodes",
          data: {
            id: "end", backgroundColor: '#0c0c0c', outlineColor: '#0c0c0c', fontColor: '#ffffff', width: '50', height:'50', shape: 'ellipse', type: 'end',
            metadata: {summary: 'end', editable: 'false', state: 'undone'}
          },
          position: { x: 0, y: 200 } }
      ];

      $scope.edgeData = [];
  }]);
})();
