(function(){
  angular.module('dashboardModule').factory('validateGraphMetadataService', ['METADATA_VALIDATION',
    function(METADATA_VALIDATION){
      var errors = [];

      /**
       Returns array of errors (if graph has been created incorrectly).
       Empty array otherwise
      */
      var validate = function(graph) {
        errors = [];
        var nodes = graph.nodes;
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          switch(node.data.type) {
            case 'task':
              var result = validateTaskNode(node);
              addErrorForNodeIfNeeded(result, node, METADATA_VALIDATION.TASK_NODE_GENERAL);
              break;
            case 'stateChange':
              var result = validateStateChangeNode(node);
              addErrorForNodeIfNeeded(result, node, METADATA_VALIDATION.STATE_CHANGE_NODE_GENERAL);
              break;
            case 'notification':
              var result = validateNotificationNode(node);
              addErrorForNodeIfNeeded(result, node, METADATA_VALIDATION.NOTIFICATION_NODE_GENERAL);
              break;
          }
        }
        return errors;
      }

      function validateTaskNode(node) {
        var metadata = node.data.metadata;
        var isSummaryFilled = metadata.summary !== undefined && metadata.summary.length > 0;
        var isDescriptionFilled = metadata.description !== undefined && metadata.description.length > 0;
        var areUsersAssigned = metadata.performers !== undefined && metadata.performers.length > 0;
        var isEvaluationScriptFilled = metadata.script !== undefined && metadata.script.length > 0;
        return isSummaryFilled && isDescriptionFilled && areUsersAssigned && isEvaluationScriptFilled;
      }

      function validateStateChangeNode(node) {
        var metadata = node.data.metadata;
        return metadata.summary !== undefined && metadata.summary.length > 0;
      }

      function validateNotificationNode(node) {
        var metadata = node.data.metadata;
        var isSummaryFilled = metadata.summary !== undefined && metadata.summary.length > 0;
        var areReceiversFilled = metadata.receivers!== undefined && metadata.receivers.length > 0;
        var isMessageFilled = metadata.message !== undefined && metadata.message.length > 0;
        return isSummaryFilled && areReceiversFilled && isMessageFilled;
      }

      function addErrorForNodeIfNeeded(result, node, key) {
        if (!result) {
          errors.push({"node": node.data.metadata.summary, "desc": key});
        }
      }

      return {
        validate: validate
      }
  }]);
})();
