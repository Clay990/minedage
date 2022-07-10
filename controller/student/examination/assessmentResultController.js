colorAdminApp.controller('assessmentResultController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile, $stateParams) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.isAssesmentResult = false;
   // $scope.selectedAssessment = $stateParams.assessment;
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
                           $scope.classAssessments =   $scope.classAssessments.filter(function(item) {
                                                      	return item.publishDate !=null;
                                                          });
                           $scope.classAssessments.unshift({ assessmentId: 0, assessmentName: "Select Assessment" });

                           // $scope.alertCategories.unshift({ })
                       }
                       else {
                           $scope.error(result.message, true);
                       }
                   }).error(function (error, status) {
                       $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
                   });

     function getResult() {

            if ( $scope.assessment.selectedAssessment != null) {
                $http.get($scope.webApiUrl + 'student/GetAssessmentResult?apiKey=' + $scope.school.appKey + '&studentId=' + $scope.user.entityId + '&classId=' + $scope.user.classId + "&academicYearId=" + $scope.academicYear.academicYearId
                    + '&assessmentId=' + $scope.assessment.selectedAssessment.assessmentId).success(function (result) {
                        if (result.status == true) {
                            $scope.assessmentResult = result.data;
                            $scope.assessments = result.data1;
                            $scope.curricularResult = result.data2;
                        }
                        else {
                            $scope.error(result.message, false);
                        }
                        $scope.isAssesmentResult = result.status;
                    }).error(function (error, status) {
                        $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
                    });

            };

     }

      $scope.getAssessmentResult = function () {
           getResult();
         };

          $scope.downloadAssessmentResult = function () {

                 $http.get($scope.webApiUrl + 'student/DownloadAssessmentResult?apiKey=' + $scope.school.appKey + '&studentId=' + $scope.user.entityId + "&academicYearId=" + $scope.academicYear.academicYearId
                   + '&classId=' + $scope.user.classId + '&sectionId=' + $scope.user.sectionId + '&assessmentId=' + $scope.assessment.selectedAssessment.assessmentId, { responseType: 'arraybuffer' }).success(function (result) {
                       var fileName = "AssessmentResult.pdf";
                       try {
                           window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function (directoryEntry) {

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

