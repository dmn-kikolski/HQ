(function(){
  'use strict';

  angular
    .module('dashboardModule')
    .controller('browseObjectsController', ['$scope', '$state', '$rootScope', 'flashService', 'objectsService',
      function($scope, $state, $rootScope, flashService, objectsService){

        $scope.objects = [];

        $scope.dataExists = function() {
          return $scope.objects !== undefined && $scope.objects !== null && $scope.objects.length > 0;
        };

        $scope.edit = function(data) {
          $state.go('dashboard.object-edit', {id: data.id});
        };

        $scope.delete = function(data) {
          console.log(data);
        };

        $scope.details = function(selectedObjectIndex) {
          console.log($scope.objects[selectedObjectIndex]);
          $state.go('dashboard.object-details', {id: $scope.objects[selectedObjectIndex].id});
        };

        $scope.create = function() {
          $state.go('dashboard.object-create-1');
        };

        $scope.run = function(selectedObjectIndex) {
          objectsService.runProccess($scope.objects[selectedObjectIndex].id).success(function(){
            $state.go($state.current, {}, {reload: true});
          });
        };

        (function(){
          objectsService.getObjects()
            .success(function(data){
              console.log('Products');
              console.log(data);
              for (var i = 0; i < data.length; i++) {
                $scope.objects[i] = {};
                $scope.objects[i].id = data[i]._id;
                $scope.objects[i].creator = data[i].creator.name;
                $scope.objects[i].creationDate = new Date(data[i].creationDate).toLocaleDateString();
                $scope.objects[i].name = data[i].name;
                $scope.objects[i].isRunning = data[i].state !== 'Not running';
                $scope.objects[i].state = data[i].state;
              }
            })
            .error(function(data){
              console.log(data);
            });
        })();

    }]);
})();
