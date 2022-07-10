colorAdminApp.controller('adminUploadOnlineExamResultController', function ($scope, $rootScope, $http, $state,$stateParams, DTOptionsBuilder, DTColumnBuilder, $filter, $compile, $q) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    Dropzone.autoDiscover = false;
    $scope.onlineExamResultId=0;
    $scope.studentOnlineExam = {examId:$stateParams.onlineExamId,examTypeId:$stateParams.onlineExamTypeId}
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

    if (app) {
        var permissions = cordova.plugins.permissions;

        permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);
        permissions.hasPermission(permissions.CAMERA, checkCameraPermissionCallback, null);


    }
function checkCameraPermissionCallback(status) {
        if (!status.hasPermission) {
            var errorCallback = function () {
                console.warn('Camera permission is not turned on');
            }
            permissions.requestPermission(
              permissions.CAMERA,
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

    $scope.dzOptions = {
        url: $scope.webApiUrl + 'shared/UploadOnlineExamResultFiles',
        autoProcessQueue: false,
       maxFiles: 10,
       parallelUploads: 10,
       maxFilesize: 400,
       timeout:1000*60*10,
       addRemoveLinks: true,
       thumbnailWidth: "200",
       thumbnailHeight: "200",
        dictDefaultMessage: "Click here to upload file(s)"
    };


    //Handle events for dropzone
    //Visit http://www.dropzonejs.com/#events for more events
    $scope.dzCallbacks = {

        'addedfile': function (file) {

            if ($scope.dzMethods.getAllFiles().length > 10) {
                $scope.error("We're sorry, but you can not upload more than 10 files.", true);
                $scope.dzMethods.removeFile(file);
                return;
            }
            if(file.name!=null)
            {
            var ext = file.name.split('.').pop();

            if (ext == "txt") {
                $(file.previewElement).find(".dz-image img").attr("src", "images/notepad-logo.png");
            } else if (ext.indexOf("doc") != -1) {
                $(file.previewElement).find(".dz-image img").attr("src", "images/word-logo.png");
            } else if (ext.indexOf("xls") != -1) {
                $(file.previewElement).find(".dz-image img").attr("src", "images/excel-logo.png");
            }
            else if (ext.indexOf("pdf") != -1) {
                $(file.previewElement).find(".dz-image img").attr("src", "images/pdf-logo.png");
            }
            }
            $scope.newFile = file;
        },
        'success': function (file, xhr) {
            $scope.success("Online Exam Result Files(s) has been uploaded Successfully", true);
            //$scope.getSavedOnlineExamResult();
           // $scope.dzMethods.removeFile(file);
           // $scope.onlineExam.description = "";
            $('#spinner').hide();
        },
        'error': function (file, xhr) {
            $scope.error("An error occured uploading Online Exam Work Flow File. Verify the file size.", true);
            $scope.dzMethods.removeFile(file);
            $('#spinner').hide();
        },
        'sending': function (file, xhr, formData) {
            $('#spinner').show();
                formData.append("onlineExamResultId",  $scope.onlineExamResultId);
                formData.append("academicYearId", $scope.academicYear.academicYearId);

        },

        'removedfile':function (file) {
             debugger;
                if (file.onlineExamResultDocumentId != null && file.onlineExamResultDocumentId != 0) {

                $http.post($scope.webApiUrl + 'shared/DeleteResultDocument', JSON.stringify({
                               apiKey: $scope.school.appKey, entityId: $scope.user.entityId,
                               onlineExamResultDocumentId: file.onlineExamResultDocumentId, academicYearId: $scope.academicYear.academicYearId

                           })).success(function (result) {
                               if (result.status == true) {
                                   $scope.success("Document has been deleted successfully", true);

                               }
                               else {
                                   $scope.error(result.message, true);
                               }
                           }).error(function (error, status) {
                               $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
                           });
                }
        }

    };


    //Apply methods for dropzone
    //Visit http://www.dropzonejs.com/#dropzone-methods for more methods
    $scope.dzMethods = {};

function dataURItoBlob(dataURI) {
    'use strict'
    var byteString,
        mimestring

    if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
        byteString = atob(dataURI.split(',')[1])
    } else {
        byteString = decodeURI(dataURI.split(',')[1])
    }

    mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0]

    var content = new Array();
    for (var i = 0; i < byteString.length; i++) {
        content[i] = byteString.charCodeAt(i)
    }

    return new Blob([new Uint8Array(content)], {type: mimestring});
}

      function onSuccess(imageData) {
     // alert(imageData);
                var blob = dataURItoBlob("data:image/jpeg;base64," + imageData);
                $scope.dzMethods.getDropzone().addFile(blob);
                $scope.dzOptions.maxFiles = $scope.dzOptions.maxFiles - 1;
      }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
         $scope.openCamera = function () {
                navigator.camera.getPicture(onSuccess, onFail, {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL
                });
         }





            function getUploadedResultDocument() {

              $http.get($scope.webApiUrl + 'shared/GetUploadedResultDocument?apiKey=' + $scope.school.appKey + '&entityId=' + $scope.user.entityId +'&roleId=' + $scope.user.roleId + "&academicYearId=" + $scope.academicYear.academicYearId +
              "&onlineExamResultId="+$scope.onlineExamResultId+"&studentId="+$stateParams.studentId).success(function (result) {
                      if (result.status == true) {

                       $scope.onlineExamResultDocument = result.data;
                         $scope.myDz = $scope.dzMethods.getDropzone();
                        $.each( $scope.onlineExamResultDocument, function (index, item) {

                           var mockFile = {
                               name: item.fileName,
                               size: item.fileSize,
                               accepted: true,
                               onlineExamResultId: item.onlineExamResultId,
                               onlineExamResultDocumentId: item.onlineExamResultDocumentId
                           };



                              $scope.myDz.emit("addedfile", mockFile);
                              $scope.myDz.emit("thumbnail", mockFile, item.fileUrl);
                              $scope.myDz.emit("complete", mockFile);
                              $scope.myDz.files.push(mockFile);
                       });
                 }
                  else {
                      $scope.error(result.message, true);
                  }
             }).error(function (error, status) {
                 $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);


               });
            }


          function getSavedStudentOnlineExamResult()
                  {

                        $http.get($scope.webApiUrl + 'shared/GetSavedStudentOnlineExamResult?apiKey=' + $scope.school.appKey + '&entityId=' + $scope.user.entityId +'&roleId=' + $scope.user.roleId + "&academicYearId=" + $scope.academicYear.academicYearId +
                        "&studentId="+$stateParams.studentId+
                        "&onlineExamId="+$stateParams.onlineExamId+
                        "&onlineExamTypeId="+$stateParams.onlineExamTypeId ).success(function (result) {
                        if (result.status == true) {
                        $scope.onlineExam = result.data;
                        if(result.data!=null){
                           $scope.onlineExamResultId = $scope.onlineExam.onlineExamResultId;
                        }
                              if($scope.onlineExamResultId!=0){
                              getUploadedResultDocument();
                              }
                            }
                            else {
                                $scope.error(result.message, true);
                            }
                        }).error(function (error, status) {
                        $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);


                    });
                  }


     getSavedStudentOnlineExamResult();


    $scope.uploadOnlineExamResult = function (form) {

        if ($scope.onlineExamForm.$invalid) {
            angular.forEach($scope.onlineExamForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
            angular.element("[name='" + $scope.onlineExamForm.$name + "']").find('.ng-invalid:visible:first').focus();
        }

        if ($scope.onlineExamForm.$valid) {

            $http.post($scope.webApiUrl + 'shared/SaveOnlineExamResult', JSON.stringify({
                apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, entityId: $scope.user.entityId,roleId: $scope.user.roleId,
                description: $scope.onlineExam.description,onlineExamId:$stateParams.onlineExamId,onlineExamTypeId:$stateParams.onlineExamTypeId,studentId:$stateParams.studentId,
                obtainedMarks :$scope.onlineExam.obtainedMarks,classId:$stateParams.classId

            })).success(function (result) {
                if (result.status == true) {
                    $scope.onlineExamResultId = result.data;
                     $scope.success("Online Exam Result has been uploaded Successfully", true);
                    if ($scope.dzMethods.getAllFiles().length > 0) {
                        $scope.dzMethods.processQueue();
                    }

                }
                else {
                    $scope.error(result.message, true);
                }
                }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
            });
        }



    }
});

