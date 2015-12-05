(function() {
  'use strict';

    angular.module('dashboardModule').directive("hqGraph",  ['buildGraphService',
      function(buildGraphService){
        return {
          restrict: 'E',
          scope: {
            hqNodes: '=',
            hqEdges: '='
          },
          link: function(scope, elementm, atrr) {
            buildGraphService.setNodes(scope.hqNodes);
            buildGraphService.setEdges(scope.hqEdges);
          }
        }
      }]);

    angular.module('dashboardModule').directive("hqComponents",  ['buildGraphService', '$rootScope',
      function(buildGraphService, $rootScope){
        return {
          restrict: 'E',
          templateUrl: 'modules/directives/hq-graph/components.html',
          replace: true,
          scope: {},
          link: function(scope, element, attributes) {
            scope.addTask = function() {
              buildGraphService.addTask();
            };

            scope.addNotification = function() {
              buildGraphService.addNotification();
            };

            scope.addState = function() {
              buildGraphService.addState();
            };

            scope.addTransition = function() {
              scope.transitionMode = !scope.transitionMode;
              buildGraphService.switchTransitionMode();
            };
          }
        }
      }]);

    angular.module('dashboardModule').directive("hqGraphComponentProperties",  ['buildGraphService', '$rootScope', 'usersService',
      function(buildGraphService, $rootScope, usersService){

        var link = function(scope, element, attributes) {
          scope.assignedUsers = [];
          usersService.getUsers()
            .success(function(data){
              scope.availableUsers = data;
              console.log('availableUsers');
              console.log(scope.availableUsers);
            });
        }

        var controller = function($scope) {
          $scope.propertiesType = null;
          $scope.element = null;

          $scope.taskManageAssignee = function(index, userId) {
            console.log('taskManageAssignee');
            console.log('index: ' + index + ' user: ' + userId);
            if ($scope.element.data.metadata.performers === undefined) {
              $scope.element.data.metadata.performers = [];
            }
            if ($scope.element.data.metadata.performersNames === undefined) {
              $scope.element.data.metadata.performersNames = [];
            }
            var clickedUserVectorIndex = $scope.element.data.metadata.performers.indexOf(userId);
            if(clickedUserVectorIndex === -1) {
              $scope.element.data.metadata.performers.push(userId);
              $scope.element.data.metadata.performersNames.push($scope.assignedUsers[index].firstName + ' ' + $scope.assignedUsers[index].lastName);
            } else {
              $scope.element.data.metadata.performers.splice(clickedUserVectorIndex,1);
              $scope.element.data.metadata.performersNames.splice(clickedUserVectorIndex,1);
            }
          };

          $scope.taskIsUserAssigned = function(index, userId) {
            if ($scope.element !== null) {
              if ($scope.element.data.metadata.performers !== undefined) {
                return $scope.element.data.metadata.performers.indexOf(userId) > -1;
              }
              return false;
            }
            return false;
          };

          $scope.edgeManageRules = function(edgeId) {
            $scope.forceNodeUpdate();
          };

          $scope.forceNodeUpdate = function() {
            $rootScope.$broadcast('graphBoard:forceNodeUpdate', {id: $scope.element.data.id});
          };

          $rootScope.$on("showEdgePropertiesEvent", function(event, element){
            $scope.showProperties = true;
            $scope.propertiesType = element.data.type;
            $scope.element = element;
            $scope.$apply();
          });

          $rootScope.$on("showNodePropertiesEvent", function(event, element){
            $scope.showProperties = true;
            $scope.propertiesType = element.data.type;
            $scope.element = element;
            $scope.$apply();
          });
        }

        return {
          restrict: 'E',
          templateUrl: 'modules/directives/hq-graph/properties.html',
          replace: true,
          scope: {},
          controller: controller,
          link: link
        }
        }]);
})();
