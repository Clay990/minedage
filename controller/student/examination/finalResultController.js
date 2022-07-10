colorAdminApp.controller('studentFinalResultController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.publishDate = new Date();

    $scope.classAssessments;
    $scope.assessment = { selectedAssessment: { assessmentId: 0 } };
    var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

    if (app) {
        var permissions = cordova.plugins.permissions;

        permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);

    }
function checkPermissionCallback(status) {
        if (!status.hasPermission) {
            var errorCallback = function () {
                console.warn('Storage permission is not turned on');
            }
            permissions.requestPermission(
              permissions.READ_EXTERNAL_STORAGE,
              function (status) {
                  if (!status.hasPermission) {
                      errorCallback();
                  } else {
                      // continue with downloading/ Accessing operation
                  }
              },
              errorCallback);
        }
    }
     $http.get($scope.webApiUrl + 'student/GetAssessment?apiKey=' + $scope.school.appKey + "&academicYearId=" + $scope.academicYear.academicYearId+ '&classId=' + $scope.user.classId
                   ).success(function (result) {

                       if (result.status == true) {
                           $scope.classAssessments = result.data;
                            $scope.resultPublishDate =  $scope.classAssessments.filter(function(item) {
                           	return item.assessmentId == "2";
                               });
                         $scope.isDownload = $scope.resultPublishDate[0].publishDate==null?false:$scope.publishDate >=new Date($scope.resultPublishDate[0].publishDate);
                       }
                       else {
                           $scope.error(result.message, true);
                       }
                   }).error(function (error, status) {
                       $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
                   });


    $scope.downloadFinalResult = function () {
      
        $http.get($scope.webApiUrl + 'student/DownloadFinalResult?apiKey=' + $scope.school.appKey + '&studentId=' + $scope.user.entityId + "&academicYearId=" + $scope.academicYear.academicYearId
          + '&classId=' + $scope.user.classId, { responseType: 'arraybuffer' }).success(function (result) {
              //var file = new Blob([result], { type: 'application/pdf;base64' });
              //var fileURL = window.URL.createObjectURL(file);
              //var seconds = new Date().getTime() / 1000;
              var fileName = "FinalResult.pdf";
              //var a = document.createElement("a");
              //document.body.appendChild(a);
              //a.style = "display: none";
              //a.href = fileURL;
              //a.download = fileName;
              //a.click();
              try {
                  window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function (directoryEntry) {
                      //$scope.success(cordova.file.externalDataDirectory);
                      directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {

                          fileEntry.createWriter(function (fileWriter) {
                              fileWriter.onwriteend = function (e) {
                                cordova.plugins.fileOpener2.open(cordova.file.cacheDirectory  + fileName, 'application/pdf',
                                                          {
                                                              error: function (e) {
                                                                  console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                                                              },
                                                              success: function () {
                                                                  console.log('file opened successfully');
                                                              }
                                                          }
                                                      );
                                  $scope.success("File has been downloaded successfully. Go to documents folder and view the downloaded file.", true);
                                  //$scope.success(fileEntry);
                                  //window.cordova.plugins.FileOpener.openFile(cordova.file.externalDataDirectory + fileName, onSuccess, onError);
                                  //var onSuccess = function (data) {
                                  //    $scope.success('message: ' + data.message);
                                  //};

                                  //// onError Callback receives a json object
                                  ////
                                  //function onError(error) {
                                  //    $scope.error('message: ' + error.message);
                                  //}
                              };

                              fileWriter.onerror = function (e) {
                                  $scope.error(e, true);
                              };

                              //Blob erstellen - Blackberry File Plugin verwenden
                              var blob = new Blob([result], { type: 'application/pdf' });

                              fileWriter.write(blob);

                          }, function onerror(e) {
                                  $scope.error(e, true);
                          });
                      }, function onerror(e) {
                              $scope.error(e, true);
                      });
                  }, function onerror(e) {
                          $scope.error(e, true);
                  });

              } catch (e) {
                  $scope.error(e, true);
              }
          }).error(function (error, status) {
              $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
          });
    }

    
});

