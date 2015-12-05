(function() {

  angular.module('dashboardModule').directive('hqTable', [function(){

    var controller = function($scope) {
      this.setColumns = function(columns) {
        $scope.columns = columns;
      }
      this.getColumns = function() {
        return $scope.columns;
      }
      this.getRows = function() {
        return $scope.data;
      }
      this.setActions = function(actions) {
        $scope.actions = actions;
      }
      this.getActions = function(actions) {
        return $scope.actions;
      }
    }

    return {
      restrict: 'E',
      controller: controller,
      scope: {
        data: '='
      }
    };
  }])

  angular.module('dashboardModule').directive('hqColumns', [function(){
    return {
      restrict: 'E',
      require: ['^hqTable', 'hqColumns'],
      controller: function() {
        var columns = [];
        this.addColumn = function(column) {
          columns.push(column);
        };
        this.getColumns = function() {
          return columns;
        };
      },
      link: function(scope, element, attributes, controllers) {
        var tableController = controllers[0];
        var columnsController = controllers[1];
        tableController.setColumns(columnsController.getColumns());
      }
    };
  }]);

  angular.module('dashboardModule').directive('hqActions', [function(){
    return {
      restrict: 'E',
      require: ['^hqTable', 'hqActions'],
      controller: function() {
        var actions = [];
        this.addAction = function(action) {
          actions.push(action);
        };
        this.getActions = function() {
          return actions;
        };
      },
      link: function(scope, element, attributes, controllers) {
        var tableController = controllers[0];
        var actionsController = controllers[1];
        tableController.setActions(actionsController.getActions());
      }
    };
  }]);

  angular.module('dashboardModule').directive('hqColumn', [function(){
    return {
      restrict: 'E',
      require: '^hqColumns',
      link: function(scope, element, attributes, columsController) {
        columsController.addColumn({
            title: attributes.title,
            field: attributes.field
          });
        }
      }
  }]);

  angular.module('dashboardModule').directive('hqAction', ['authenticationService',
  function(authenticationService){
    return {
      restrict: 'E',
      require: '^hqActions',
      scope: {
        name: '@',
        role: '@',
        perform: '&'
      },
      link: function(scope, element, attributes, actionsController) {
        if (authenticationService.checkRight(scope.role)) {
          actionsController.addAction({
            name: scope.name,
            action: scope.perform
          });
        }
      }
    };
  }]);

  angular.module('dashboardModule').directive('hqBody', [function(){
    return {
      restrict: 'E',
      templateUrl: 'modules/directives/hq-table/hq-table.html',
      replace: true,
      require: '^hqTable',
      link: function(scope, element, attributes, tableController) {
        scope.rows = tableController.getRows();
        scope.columns = tableController.getColumns().reverse();
        scope.actions = tableController.getActions();
      },
      controller: function($scope) {
        $scope.fire = function(row, action) {
          var callback = action.action;
          callback()(row);
        }
      }

    }
  }]);

})();
