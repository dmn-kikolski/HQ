(function(){
  'use strict';

  angular
    .module('dashboardModule')
    .controller('browseWorkflowsController', ['$scope', '$state', 'workflowsService', 'ngDialog',
      function($scope, $state, workflowsService, ngDialog){
        var openedDialog = null;
        $scope.workflows = [];
        $scope.templateToRemove = null;

        $scope.create = function() {
          $state.go('dashboard.workflow-create');
        };

        $scope.edit = function(index) {
          var workflowId = $scope.workflows[index]._id;
          $state.go('dashboard.workflow-edit', {id: workflowId});
        };

        $scope.details = function(index) {
          var workflowId = $scope.workflows[index]._id;
          $state.go('dashboard.workflow-details', {id: workflowId});
        };

        $scope.delete = function(index) {
          var workflowId = $scope.workflows[index]._id;
          $scope.templateToRemove = workflowId;
          openedDialog = ngDialog.open({
            template: 'modules/dashboard-workflows/templates/dialogDeleteTemplate.html',
            scope: $scope
          });
        };

        $scope.confirmDelete = function() {
          workflowsService.deleteById($scope.templateToRemove)
            .success(function(){
              openedDialog.close();
              $state.go($state.current, {}, {reload: true});
            })
            .error(function(data){
              console.log(data);
            });
        };

        $scope.rejectDelete = function() {
          openedDialog.close();
        };

        (function() {
          console.log('browseWorkflowsController::init::start');
          workflowsService.getAll()
            .success(function(data){
              $scope.workflows = data;
              console.log($scope.workflows);
              for (var i = 0; i < $scope.workflows.length; i++) {
                var creationDateForUser = new Date($scope.workflows[i].creationDate);
                var editionDateForUser = new Date($scope.workflows[i].editionDate);
                $scope.workflows[i].creationDate = creationDateForUser.toLocaleDateString();
                $scope.workflows[i].editionDate = editionDateForUser.toLocaleDateString();
              }
              console.log('browseWorkflowsController::init::end');
            })
            .error(function(message){
              console.log(message);
            });
        })();

  }]);
})();
