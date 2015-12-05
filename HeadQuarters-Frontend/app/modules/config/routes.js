/*
 * Configuration contains routes used for managing enterpage content.
 */
(function(){
  'use strict';

  angular
    .module('enterpageModule')
    .factory('sessionTokenInjector', ['sessionService', function (sessionService) {
      var sessionInjector = {
        requst: function(config) {
            config.headers['x-session-token'] = sessionService.getSessionToken();
            return config;
        }
      };
      return sessionInjector;
    }])
    .config(['$urlRouterProvider','$stateProvider', '$httpProvider', function($urlRouterProvider, $stateProvider, $httpProvider){
        $urlRouterProvider.otherwise('/login');

        $stateProvider
        .state('enterpage',{
          url: '/',
          abstract: true,
          templateUrl: 'modules/enterpage/templates/enterpage.html'
        })
        .state('enterpage.home',{
          url: 'home',
          templateUrl: 'modules/enterpage/templates/home.html'
        })
        .state('enterpage.whatsnew',{
          url: 'whats-new',
          templateUrl: 'modules/enterpage/templates/whats-new.html',
          controller: 'whatsNewController'
        })
        .state('enterpage.login',{
          url: 'login',
          templateUrl: 'modules/enterpage/templates/login.html',
          controller: 'loginController'
        })
        .state('dashboard',{
          url: '/dashboard',
          templateUrl: 'modules/dashboard-core/templates/dashboard.html',
          controller: 'dashboardCoreController'
        })
        .state('dashboard.objects-browse',{
          url: '/objects',
          templateUrl: 'modules/dashboard-objects/templates/browse.html',
          controller: 'browseObjectsController'
        })
        .state('dashboard.object-create-1',{
          url: '/objects/create/step/1',
          templateUrl: 'modules/dashboard-objects/templates/create-1.html',
          controller: 'createObjectFirstStepController'
        })
        .state('dashboard.object-create-2',{
          url: '/objects/create/step/2',
          templateUrl: 'modules/dashboard-objects/templates/create-2.html',
          controller: 'createObjectSecondStepController'
        })
        .state('dashboard.object-details',{
          url: '/objects/details/:id',
          templateUrl: 'modules/dashboard-objects/templates/details.html',
          controller: 'detailsObjectController',
          resolve: {
            productData:  function($http, $stateParams, ACTION){
              return $http({method: 'GET', url: ACTION.GET_REMOTE + 'products/get/' + $stateParams.id})
                .then (function (value) {
                  var data = {};
                  console.log(value.data);
                  data.name = value.data.name;
                  data.description = value.data.description;
                  data.id = value.data._id;
                  data.creator = value.data.creator;
                  data.graph = value.data.workflow;
                  return data;
              });
            },
          }
        })
        .state('dashboard.object-edit',{
          url: '/objects/edit/:id',
          templateUrl: 'modules/dashboard-objects/templates/edit.html',
          controller: 'editObjectController'
        })
        .state('dashboard.users-browse',{
          url: '/users',
          templateUrl: 'modules/dashboard-users/templates/browse.html',
          controller: 'browseUsersController'
        })
        .state('dashboard.user-details',{
          url: '/users/details/:id',
          templateUrl: 'modules/dashboard-users/templates/user-details.html',
          controller: 'userDetailsController',
        })
        .state('dashboard.user-create',{
          url: '/users/create',
          templateUrl: 'modules/dashboard-users/templates/create.html',
          controller: 'createUserController'
        })
        .state('dashboard.tasks-browse',{
          url: '/tasks',
          templateUrl: 'modules/dashboard-tasks/templates/browse.html',
          controller: 'browseTasksController'
        })
        .state('dashboard.task-details',{
          url: '/tasks/details/',
          templateUrl: 'modules/dashboard-tasks/templates/details.html',
          controller: 'detailsTaskController',
          params: {data: null}
        })
        .state('dashboard.workflows-browse',{
          url: '/workflows',
          templateUrl: 'modules/dashboard-workflows/templates/browse.html',
          controller: 'browseWorkflowsController'
        })
        .state('dashboard.workflow-create',{
          url: '/workflows/create',
          templateUrl: 'modules/dashboard-workflows/templates/create.html',
          controller: 'createWorkflowController'
        })
        .state('dashboard.stats-browse',{
          url: '/stats',
          templateUrl: 'modules/dashboard-stats/templates/stats.html',
          controller: 'statsController'
        })
        .state('dashboard.workflow-edit',{
          url: '/workflows/edit/:id',
          templateUrl: 'modules/dashboard-workflows/templates/edit.html',
          controller: 'editWorkflowController',
          resolve: {
            workflowData:  function($http, $stateParams, ACTION){
              return $http({method: 'GET', url: ACTION.GET_REMOTE + 'workflows/details/' + $stateParams.id})
                .then (function (value) {
                  var data = {};
                  data.name = value.data.name;
                  data.description = value.data.description;
                  data.id = value.data._id;
                  data.creator = value.data.creator;
                  data.graph = value.data.graph;
                  return data;
              });
            },
          }
        })
        .state('dashboard.workflow-details',{
          url: '/workflows/details/:id',
          templateUrl: 'modules/dashboard-workflows/templates/details.html',
          controller: 'detailsWorkflowController',
          resolve: {
            workflowData:  function($http, $stateParams, ACTION){
              return $http({method: 'GET', url: ACTION.GET_REMOTE + 'workflows/details/' + $stateParams.id})
                .then (function (value) {
                  var data = {};
                  data.name = value.data.name;
                  data.description = value.data.description;
                  data.id = value.data._id;
                  data.creator = value.data.creator;
                  data.graph = value.data.graph;
                  return data;
              });
            },
          }
        })
        .state('dashboard.user-profile',{
          url: '/profile',
          templateUrl: 'modules/dashboard-user-profile/templates/user-profile.html',
          controller: 'userProfileController'
        })
        .state('dashboard.logout',{
          url: '/logout',
          templateUrl: 'modules/dashboard-core/templates/logout.html',
          controller: 'logoutController'
        });

        $httpProvider.interceptors.push('sessionTokenInjector');
  }]);
})();
