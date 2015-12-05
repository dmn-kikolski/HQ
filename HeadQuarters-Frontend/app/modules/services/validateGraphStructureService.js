(function(){
  angular.module('dashboardModule').factory('validateGraphStructureService', ['STRUCTURE_VALIDATION',
    function(STRUCTURE_VALIDATION){
      var errors = [];

      /**
       Returns array of errors (if graph has been created incorrectly).
       Empty array otherwise
      */
      var validate = function(graph) {
        errors = [];
        var nodes = graph.nodes;
        var edges = graph.edges;
        var result = null;
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          switch(node.data.type) {
            case 'start':
              result = validateStartNode(edges, node);
              addErrorForNodeIfNeeded(result, node, STRUCTURE_VALIDATION.START_NODE_GENERAL);
              break;
            case 'end':
              result = validateEndNode(edges, node);
              addErrorForNodeIfNeeded(result, node, STRUCTURE_VALIDATION.END_NODE_GENERAL);
              break;
            case 'task':
              result = validateTaskNode(edges, node);
              addErrorForNodeIfNeeded(result, node, STRUCTURE_VALIDATION.TASK_NODE_GENERAL);
              break;
            case 'stateChange':
              result = validateStateChangeNode(edges, node);
              addErrorForNodeIfNeeded(result, node, STRUCTURE_VALIDATION.STATE_CHANGE_NODE_GENERAL);
              break;
            case 'notification':
              result = validateNotificationNode(edges, node);
              addErrorForNodeIfNeeded(result, node, STRUCTURE_VALIDATION.NOTIFICATION_NODE_GENERAL);
              break;
          }
        }
        return errors;
      };

      /**
       Each 'task' node should have at least two outgoing edges -
       for a success result, and one for failure.
      */
      function validateTaskNode(edges, node) {
        var foundSuccessEdge = false;
        var foundFailureEdge = false;
        var outgoingEdgesNumber = 0;
        var incomingEdgesNumber = 0;
        for (var i = 0; i < edges.length; i++) {
          if (edges[i].data.source === node.data.id) {
            outgoingEdgesNumber++;
            if(edges[i].data.metadata.rule === 'success') {
              foundSuccessEdge = true;
            }
            else if(edges[i].data.metadata.rule === 'failure') {
              foundFailureEdge = true;
            }
          }
          if (edges[i].data.target === node.data.id) {
            incomingEdgesNumber++;
          }
        }
        return foundFailureEdge && foundSuccessEdge && outgoingEdgesNumber === 2 && incomingEdgesNumber > 0;
      }

      /**
        'StateChange' node must have only one outgoing edge
      */
      function validateStateChangeNode(edges, node) {
        var outgoingEdges = countOutgoingEdges(edges, node);
        return outgoingEdges === 1;
      }

      /**
        'Notification' node must have only one outgoing edge and zero incoming edges
      */
      function validateNotificationNode(edges, node) {
        var outgoingEdges = countOutgoingEdges(edges, node);
        return outgoingEdges === 1;
      }

      /**
        'Start' node must have only one outgoing edge, and
      */
      function validateStartNode(edges, node) {
        var outgoingEdgesNumber = 0;
        var isCorrect = true;
        for (var i = 0; i < edges.length; i++) {
          if (edges[i].data.source === node.data.id) {
            outgoingEdgesNumber++;
            if (outgoingEdgesNumber > 1) {
              isCorrect = false;
              break;
            }
          }
          if (edges[i].data.target === node.data.id) {
            isCorrect = false;
            break;
          }
        }
        if (outgoingEdgesNumber !== 1) {
          isCorrect = false;
        }
        return isCorrect;
      }

      function validateEndNode(edges, node) {
        var isCorrect = true;
        var incomingEdgesNumber = 0;
        for (var i = 0; i < edges.length; i++) {
          if (edges[i].data.source === node.data.id) {
            isCorrect = false;
            break;
          }
          if (edges[i].data.target === node.data.id) {
            incomingEdgesNumber++;
          }
        }
        if (incomingEdgesNumber === 0) {
          isCorrect = false;
        }
        return isCorrect;
      }

      /**
        Returns true if exists node which points to itself. False otherwise.
      */
      function checkIfAnyNodePointsToItself(edges, node) {
        for (var i = 0; i < edges.length; i++) {
          if (edges[i].data.source === edges[i].data.target) {
            return true;
          }
        }
        return false;
      }

      function countOutgoingEdges(edges, node) {
        var outgoingEdges = 0;
        for (var i = 0; i < edges.length; i++) {
          if (edges[i].data.source === node.data.id) {
            outgoingEdges++;
          }
        }
        return outgoingEdges;
      }

      /**
        Adds to erros array new object containing incorrect node name and description.
      */
      function addErrorForNodeIfNeeded(result, node, key) {
        if (!result) {
          errors.push({'node': "'" + node.data.metadata.summary + "'", 'desc': key});
        }
      }

      return {
        validate: validate
      };
  }]);
})();
