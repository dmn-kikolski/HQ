(function(){
  angular.module('enterpageModule').controller('whatsNewController', ['$scope','whatsNewService',
    function($scope, whatsNewService){
      whatsNewService.get(function(data) {
        $scope.releaseNotes = data;
      })
  }])
})();
