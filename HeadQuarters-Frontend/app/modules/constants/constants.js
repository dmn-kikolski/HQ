(function(){
  'use strict';

  var REMOTE_URL = 'http://localhost:3000/';

  angular.module('remoteConnectionConst')
  .constant('ACTION',{
    'GET_REMOTE'                 : REMOTE_URL,
    'LOGIN'                      : REMOTE_URL + 'authorization/login',
    'LOGOUT'                     : REMOTE_URL + 'authorization/logout',
    'CHECK_RIGHTS'               : REMOTE_URL + 'authorization/checkRights',
    'GET_USERS'                  : REMOTE_URL + 'users',
    'PROFILE'                    : REMOTE_URL + 'users/profile',
    'GET_USER_DETAILS'           : REMOTE_URL + 'users/details/',
    'CREATE_USER'                : REMOTE_URL + 'users/create',
    'REMOVE_USER'                : REMOTE_URL + 'users/remove',
    'EDIT_USER'                  : REMOTE_URL + 'users/details/edit',
    'EDIT_USER_PASSWORD'         : REMOTE_URL + 'users/password/edit',
    'GET_WORKFLOWS'              : REMOTE_URL + 'workflows/all',
    'WORKFLOW_SAVE_WORKING_COPY' : REMOTE_URL + 'workflows/create',
    'WORKFLOW_SAVE_TEMPLATE'     : REMOTE_URL + 'workflows/create',
    'WORKFLOW_UPDATE'            : REMOTE_URL + 'workflows/update',
    'GET_WORKFLOWS_TEMPLATES'    : REMOTE_URL + 'workflows/templates/full',
    'GET_WORKFLOW'               : REMOTE_URL + 'workflows/details/',
    'DELETE_WORKFLOW'            : REMOTE_URL + 'workflows/delete',
    'OBJECT_CREATE'              : REMOTE_URL + 'products/create',
    'GET_OBJECTS'                : REMOTE_URL + 'products/all',
    'GET_OBJECTS_BASIC'          : REMOTE_URL + 'products/getBasic/',
    'PROCESS_OBJECT'             : REMOTE_URL + 'products/run',
    'GET_TASKS'                  : REMOTE_URL + 'tasks/get/',
    'ACCEPT_TASK'                : REMOTE_URL + 'tasks/accept',
    'REJECT_TASK'                : REMOTE_URL + 'tasks/reject',
    'GET_REPORT_TASKS'           : REMOTE_URL + 'reports/tasks',
    'GET_REPORT_PRODUCTS'        : REMOTE_URL + 'reports/products',
    'GET_REPORT_UNDONE_TASKS'    : REMOTE_URL + 'reports/tasks/undone',
    'GET_REPORT_UNDONE_PRODUCTS' : REMOTE_URL + 'reports/products/undone',
    'GET_REPORT_FINISHED_PRODUCTS': REMOTE_URL + 'reports/products/done',
    'GET_REPORT_FINISHED_TASKS'  : REMOTE_URL + 'reports/tasks/done'
  });

  angular.module('dashboardModule')
  .constant('STRUCTURE_VALIDATION',{
    'TASK_NODE_GENERAL'         : 'must have two outgoing edges: for success and failure case',
    'NOTIFICATION_NODE_GENERAL' : 'must have one outgoing edge',
    'STATE_CHANGE_NODE_GENERAL' : 'must have one outgoing edge',
    'START_NODE_GENERAL'        : 'must have only one outgoing edge and no incoming edges',
    'END_NODE_GENERAL'          : 'must have at least one incoming edge and must have no outcoming edges',
    'NO_ISOLATED_NODES'         : 'must not be isolated nodes in the graph'
  });

  angular.module('dashboardModule')
  .constant('METADATA_VALIDATION',{
    'TASK_NODE_GENERAL'         : 'properties of this task are not filled properly',
    'NOTIFICATION_NODE_GENERAL' : 'properties of this notification are not filled properly',
    'STATE_CHANGE_NODE_GENERAL' : 'properties of this state are not filled properly'
  });

  angular.module('securityModule')
  .constant('SECURED',{
    'ROUTES': ['/dashboard']
  });
})();
