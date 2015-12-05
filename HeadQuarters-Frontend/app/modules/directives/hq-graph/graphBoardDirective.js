angular.module('dashboardModule').directive('hqGraphBoard', ['$rootScope', 'buildGraphService', 'flashService',
  function($rootScope, buildGraphService, flashService){
    var link = function(scope, element, attributes) {
      scope.selectedSourceItem = null;
      scope.selectedTargetItem = null;

      scope.board = cytoscape({
        container: document.getElementById('hq-graph'),
        ready: function() {
          scope.board.load(buildGraphService.getElements());
        },
        layout: {
          name: 'preset',
          directed: true,
          roots: '#start'
        },
        wheelSensitivity: 0.1,
        style: cytoscape.stylesheet()
          .selector('node')
            .css({
            'shape': 'data(shape)',
            'width': 'data(width)',
            'height': 'data(height)',
            'text-valign': 'center',
            'background-fit': 'cover',
            'font-size': '16',
            'background-color': 'data(backgroundColor)',
            'color': 'data(fontColor)',
            'content': 'data(metadata.summary)',
            'text-outline-width': 1,
            'text-outline-color': '#676767',
            'border-color': 'data(outlineColor)',
            'border-width': 3,
          })
          .selector('edge')
            .css({
            'target-arrow-shape': 'triangle',
            'width': 'data(edgeWidth)',
            'line-color': 'data(color)',
            'content': 'data(metadata.rule)',
            'text-valign': 'bottom',
            'edge-text-rotation': 'autorotate',
            'color': '#fff',
            'font-size': '24',
            'text-outline-width': 1,
            'target-arrow-color': 'data(color)'
          })
          .selector(':selected')
            .css({
              'border-color': '#2c2c2c',
              'border-width': 6,
              'line-color': '#2c2c2c',
              'line-style': 'dotted',
              'target-arrow-color': '#2c2c2c',
              'source-arrow-color': '#2c2c2c'
            })
      });

      var defaultCommands = [
        { content: 'Delete',
          select: function(){deleteElement(this);}
        },
        { content: 'Properties',
          select: function(){showProperties(this);}
        },
        { content: 'Cancel',
          select: function(){/*Just do nothing*/}
        }
      ];

      var previewCommands = [
        { content: 'Properties',
          select: function(){showProperties(this);}
        },
        { content: 'Cancel',
          select: function(){/*Just do nothing*/}
        }
      ]

      var commands = defaultCommands;

      if(attributes['preview'] === 'true')
        commands = previewCommands;

      var contextMenuSettings = {
        menuRadius: 100,
        selector: 'node, edge',
        commands: commands,
        fillColor: 'rgba(0, 0, 0, 0.75)',
        activeFillColor: 'rgba(92, 194, 237, 0.75)',
        activePadding: 20,
        indicatorSize: 24,
        separatorWidth: 3,
        spotlightPadding: 4,
        minSpotlightRadius: 24,
        maxSpotlightRadius: 38,
        itemColor: 'white',
        itemTextShadowColor: 'black',
        zIndex: 9999
      };

      var contextMenuAPI = scope.board.cxtmenu(contextMenuSettings);

      scope.board.on('tap',function(event){
        if( event.cyTarget === scope.board )
            clearSelection();
      });

      scope.board.on('select', 'node', function(event){
        if (buildGraphService.isTransitionMode()) {
          if (scope.selectedSourceItem === null) {
            scope.selectedSourceItem = event.cyTarget;
          } else {
            scope.selectedTargetItem = event.cyTarget;
            if(!buildGraphService.checkIfTransitionExists(scope.selectedSourceItem, scope.selectedTargetItem)) {
              buildGraphService.addTransition(scope.selectedSourceItem, scope.selectedTargetItem);
              clearSelection();
            } else {
              clearSelection();
            }
          }
        }
      });

      $rootScope.$on('addElementEvent', function(event, args){
        scope.board.add(args.data);
      });

      $rootScope.$on('switchTransitionModeEvent', function(){
        clearSelection();
      });

      $rootScope.$on('graphBoard:downloadAsImage', function(){
        var image = scope.board.png();
        window.open(image);
      });

      $rootScope.$on('graphBoard:forceNodeUpdate', function(event, data){
        // forcing node label update
        scope.board.$("#" + data.id).lock();
        scope.board.$("#" + data.id).unlock();
      });

      var supportedElementTypes = ['task','notification','stateChange']

      var showProperties = function(element) {
        if (element.data().type === 'edge') {
          var source = buildGraphService.getNode(element.data().source);
          if (source.data.type === 'task') {
            buildGraphService.showEdgeProperties(element.data());
          } else {
            flashService.info({header: "No properties available for this transition", content: ""})
          }
        }
        else if (supportedElementTypes.indexOf(element.data().type) > -1){
          buildGraphService.showNodeProperties(element.data());
        }
      }

      var deleteElement = function(element) {
          if(element.group() === 'nodes' && element.data().metadata.editable !== 'false') {
            deleteNode(element.id());
          }
          else if (element.group() === 'edges')
            deleteEdge(element.id());
      };

      var deleteNode = function(id) {
        var deletedElements = buildGraphService.deleteNode(id);
        for (i = 0; i < deletedElements.length; i++) {
          var node = scope.board.$("#"+deletedElements[i]);
          scope.board.remove(node);
        }
      };

      var deleteEdge = function(id) {
        var removedElement = buildGraphService.deleteEdge(id);
        var edge = scope.board.$("#"+removedElement);
        scope.board.remove(edge);
      };

      var clearSelection = function() {
        if (scope.selectedSourceItem !== null) {
          scope.selectedSourceItem.unselect();
          scope.selectedSourceItem = null;
        }
        if (scope.selectedTargetItem !== null) {
          scope.selectedTargetItem.unselect();
          scope.selectedTargetItem = null;
        }
      };
    };

    return {
        restrict: 'E',
        templateUrl: 'modules/directives/hq-graph/graphBoard.html',
        replace: true,
        scope: {},
        link: link
    };
}]);
