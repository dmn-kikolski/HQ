'use strict';

angular
  .module('dashboardModule')
  .controller('statsController', ['$scope', '$state', 'reportService', 'flashService',
    function($scope, $state, reportService, flashService){
      $scope.downloadOptions = ['Products'];
      $scope.downloadFormats = ['JSON', 'TXT', 'CSV'];
      $scope.downloadTypes = ['All', 'In progress', 'Completed'];

      $scope.download = function() {
        console.log($scope.downloadOption);
        if ($scope.downloadOption === 'Products') {
          getReportForProducts($scope.downloadFormat, $scope.downloadType, $scope.downloadDivider);
        }
        else if ($scope.downloadOption === 'Tasks') {
          getReportForTasks($scope.downloadFormat, $scope.downloadType);
        }
      };

      $scope.disableButton = function() {
        var isFormatSelected = $scope.downloadFormat !== null && $scope.downloadFormat !== undefined;
        var isDownloadTypeSelected = $scope.downloadType !== null && $scope.downloadType !== undefined;
        var isDownloadFormatSelected = $scope.downloadFormat !== null && $scope.downloadFormat !== undefined;
        return !(isFormatSelected && isDownloadTypeSelected && isDownloadFormatSelected);
      };

      function getReportForProducts(format, type, divider) {
        if (type === 'All') {
          if (format === 'CSV' || format === 'TXT') {
            reportService.getReportForProducts(format, divider).success(processResponseCSV).error(noDataFound);
          }
          else if (format === 'JSON') {
            reportService.getReportForProducts(format, divider).success(processResponseJSON).error(noDataFound);
          }
        } else if (type === 'In progress') {
          if (format === 'CSV' || format === 'TXT') {
             reportService.getUndoneProducts(format, divider).success(processResponseCSV).error(noDataFound);
          }
          else if (format === 'JSON') {
            reportService.getUndoneProducts(format, divider).success(processResponseJSON).error(noDataFound);
          }
        } else {
          if (format === 'CSV' || format === 'TXT') {
            reportService.getFinishedProducts(format, divider).success(processResponseCSV).error(noDataFound);
          }
          else if (format === 'JSON'){
            reportService.getFinishedProducts(format, divider).success(processResponseJSON).error(noDataFound);
          }
        }
      }

      function getReportForTasks(format, type) {
        if (type === 'All') {
          reportService.getReportForTasks(format);
        } else if (type === 'undone') {
          reportService.getUndoneTasks(format);
        } else {
          reportService.getFinishedTasks(format);
        }
      }

      var processResponseCSV = function (data) {
        document.location = 'data:Application/octet-stream,' + encodeURIComponent(data);
      };

      var processResponseJSON = function (data) {
        document.location = 'data:Application/octet-stream,' + encodeURIComponent(JSON.stringify(data));
      };

      var noDataFound = function() {
        var message = {};
        message.header = 'No data found';
        message.content = '';
        flashService.error(message);
      };
}]);
