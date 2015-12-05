(function(){
  angular.module('dashboardModule').factory('buildGraphService', ['$rootScope', 'flashService',
    function($rootScope, flashService){

      var elements = {
        nodes: [],
        edges: []
      };

      var transitionMode = false;

      var setNodes = function(nodes) {
        elements.nodes = nodes;
      };

      var getNodes = function() {
        return elements.nodes;
      };

      var setEdges = function(edges) {
        elements.edges = edges;
      };

      var getEdges = function() {
        return elements.edges;
      };

      var getElements = function() {
        return elements;
      };

      var getNode = function(id) {
        var result = null;
        elements.nodes.forEach(function(element){
          if(element.data.id === id)
            result = element;
        });
        return result;
      }

      var switchTransitionMode = function() {
        transitionMode = !transitionMode;
        $rootScope.$broadcast('switchTransitionModeEvent');
      }

      var isTransitionMode = function() {
        return transitionMode;
      }

      var addTask = function() {
        var node = generateNode('task');
        elements.nodes.push(node);
        $rootScope.$broadcast('addElementEvent', {data: node});
      };

      var addNotification = function() {
        var node = generateNode('notification');
        elements.nodes.push(node);
        $rootScope.$broadcast('addElementEvent', {data: node});
      };

      var addState = function() {
        var node = generateNode('stateChange');
        elements.nodes.push(node);
        $rootScope.$broadcast('addElementEvent', {data: node});
      };

      var addTransition = function(source, target) {
          var id = generateNextId(elements.edges, 'e');
          var edge = generateEdge(id, source.data("id"), target.data("id"));
          elements.edges.push(edge);
          $rootScope.$broadcast('addElementEvent', {data: edge});
      };

      var checkIfTransitionExists = function(source, target) {
        var exists = false;

        if (checkIfSourceAndTargetAreNotTheSameNode(source, target))
          return true;

        elements.edges.forEach(function(element){
            if (element.data.source === source.data("id") && element.data.target === target.data("id"))
              exists = true;
        });
        return exists;
      };

      var checkIfSourceAndTargetAreNotTheSameNode = function(source, target) {
        return source.data("id") === target.data("id");
      };

      var generateNode = function(type) {
        var data = null;
        if (type === 'task')
          data = generateTaskData(prepareBasicData('node'));
        else if (type === 'notification')
          data = generateNotificationData(prepareBasicData('node'));
        else
          data = generateStateChangeData(prepareBasicData('node'));

        return {
          group: 'nodes',
          data: data,
          position: {
            x: 0, y: 0
          }
        }
      };

      var generateEdge = function(generatedId, s, t) {
        return {
          group: "edges",
          data: {
            id: generatedId,
            color: '#525252',
            edgeWidth: '2',
            type: 'edge',
            metadata: {},
            source: s,
            target: t
          }
        }
      };

      var reset = function() {
        elements = {
          nodes: [],
          edges: []
        };
      }

      var generateTaskData = function(basicData) {
        basicData.type='task';
        basicData.backgroundColor= '#df0be4';
        basicData.outlineColor= '#78087a';
        basicData.fontColor='#ffffff';
        basicData.metadata.summary = "Task id: " + basicData.id;
        return basicData;
      };

      var generateNotificationData = function(basicData) {
        basicData.type='notification';
        basicData.backgroundColor= '#00b389';
        basicData.outlineColor= '#125e4c';
        basicData.fontColor='#ffffff';
        basicData.metadata.summary = "Notification id: " + basicData.id;
        return basicData;
      };

      var generateStateChangeData = function(basicData) {
        basicData.type='stateChange';
        basicData.backgroundColor= '#fa8100';
        basicData.outlineColor= '#b57026';
        basicData.fontColor='#ffffff';
        basicData.metadata.summary = "State id: " + basicData.id ;
        return basicData;
      };

      var generateNextIdForNode = function() {
        return generateNextId(elements.nodes, 'n');
      };

      var generateNextIdForEdge = function() {
        return generateNextId(elements.edges, 'e');
      };

      var generateNextId = function(elements, type) {
        var maxId = 0;
        for (i = 0; i < elements.length; i++) {
          var currentId = parseInt(elements[i].data.id);
          if (currentId > maxId)
            maxId = currentId;
        }
        maxId++;
        return maxId.toString() + type;
      };

      var prepareBasicData = function(type) {
        var generatedId = -1;
        if (type === 'node')
          generatedId = generateNextIdForNode();
        else
          generatedId = generateNextIdForEdge();

        return {
          id: generatedId,
          metadata: {},
          shape: 'roundrectangle',
          width: '150',
          height: '50',
        }
      };

      var showNodeProperties = function(elementData) {
        $rootScope.$broadcast('showNodePropertiesEvent', {data: elementData});
      };

      var showEdgeProperties = function(elementData) {
        $rootScope.$broadcast('showEdgePropertiesEvent', {data: elementData});
      };

      var downloadAsPng = function() {
        $rootScope.$broadcast('graphBoard:downloadAsImage');
      }

      var deleteEdge = function(id) {
        var removedElement = null;
          for (i = 0; i < elements.edges.length; i++) {
            if (elements.edges[i].data.id === id) {
              removedElement = elements.edges[i].data.id;
              elements.edges.splice(i,1);
              break;
            }
          }
          return removedElement;
      };

      var deleteNode = function(id) {
        var removedElements = [];
        // delete edges where removed node was a target or a source

        for (i = 0; i < elements.edges.length; i++) {
          if (elements.edges[i].data.target === id || elements.edges[i].data.source === id) {
            removedElements.push(elements.edges[i].data.id);
          }
        }

        for (i = 0; i < removedElements.length; i++) {
          for (j = 0; j < elements.edges.length; j++) {
            if (elements.edges[j].data.id === removedElements[i] || elements.edges[j].data.id === removedElements[i]) {
              elements.edges.splice(j,1);
              break;
            }
          }
        }

        // delete node
        for (i = 0; i < elements.nodes.length; i++) {
          if (elements.nodes[i].data.id === id) {
            removedElements.push(elements.nodes[i].data.id);
            elements.nodes.splice(i,1);
            break;
          }
        }
        return removedElements;
      };

      return {
        reset: reset,
        setNodes: setNodes,
        getNodes: getNodes,
        getNode: getNode,
        setEdges: setEdges,
        getEdges: getEdges,
        deleteNode: deleteNode,
        deleteEdge: deleteEdge,
        addTask: addTask,
        addNotification: addNotification,
        addState: addState,
        addTransition: addTransition,
        switchTransitionMode: switchTransitionMode,
        isTransitionMode: isTransitionMode,
        showNodeProperties: showNodeProperties,
        showEdgeProperties: showEdgeProperties,
        getElements: getElements,
        downloadAsPng: downloadAsPng,
        checkIfTransitionExists: checkIfTransitionExists
      }
  }]);
})();
