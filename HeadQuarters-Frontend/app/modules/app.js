(function() {
  'use strict';

  angular
    .module('headquartersApp', [
      'ngAnimate',
      'ngCookies',
      'ngRoute',
      'ngSanitize',
      'ui.router',
      'ui.date',
      'ngDialog',
      'enterpageModule',
      'dashboardModule'
    ]);

    angular.module('remoteConnectionConst',[]);

    angular.module('enterpageModule', ['ngRoute', 'ui.router', 'securityModule']);

    angular.module('securityModule', ['remoteConnectionConst']);

    angular.module('dashboardModule', ['securityModule']);
})();
