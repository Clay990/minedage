colorAdminApp.controller('uploadOnlineExamWorkController', function ($scope, $rootScope, $http, $state,$stateParams, DTOptionsBuilder, DTColumnBuilder, $filter, $compile, $q) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    Dropzone.autoDiscover = false;
    $scope.onlineExamWorkId=0;
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
        url: $scope.webApiUrl + 'student/UploadOnlineExamWorkFiles',
        autoProcessQueue: false,
               maxFiles: 10,
               parallelUploads: 10,
               maxFilesize: 400,
               timeout:1000*60*10,
               addRemoveLinks: true,
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
            $scope.success("Answer Sheet has been uploaded Successfully", true);
            $('#spinner').hide();
            $scope.dzMethods.removeFile(file);
            $scope.onlineExam.description = "";
            $scope.getSavedOnlineExams();
        },
        'error': function (file, xhr) {
            $scope.error("An error occured uploading Answer Sheet File. Verify the file size.", true);
            $('#spinner').hide();
            $scope.dzMethods.removeFile(file);
        },
        'sending': function (file, xhr, formData) {
        $('#spinner').show();
                formData.append("onlineExamWorkId",  $scope.onlineExamWorkId);
                formData.append("academicYearId", $scope.academicYear.academicYearId);

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

         function getSavedOnlineExams(sSource, aoData, fnCallback, oSettings) {
          var draw = aoData[0].value;
                 $scope.draw = draw;
                $http.get($scope.webApiUrl + 'shared/GetSavedOnlineExamWork?apiKey=' + $scope.school.appKey + '&entityId=' + $scope.user.entityId + '&roleId=' + $scope.user.roleId +'&studentId=' + $scope.user.entityId + "&academicYearId=" + $scope.academicYear.academicYearId +
                "&onlineExamId="+ $stateParams.onlineExamId+ "&onlineExamTypeId="+ $stateParams.onlineExamTypeId ).success(function (result) {
                        if (result.status == true) {
                            $scope.onlineExamWork = result.data;
                            var records = {
                                'draw': draw,
                                'recordsTotal': result.recordsTotal,
                                'recordsFiltered': result.recordsFiltered,
                                'data': result.data
                            };
                            fnCallback(records);
                        }
                        else {
                            $scope.error(result.message, true);
                        }
                    }).error(function (error, status) {
                        $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
                    });
         }
         $scope.orderInstance = {};
                     $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getSavedOnlineExams)
                         .withOption('processing', false)
                         .withOption('oLanguage', {
                             "sZeroRecords": "No Record Found.",
                         }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
                         .withOption('serverSide', true)
                         .withPaginationType('full_numbers')
                         .withOption('createdRow', createdRow)
                         .withOption('autoWidth', false)
                         .withBootstrap()

                     $scope.orderColumns = [

                         DTColumnBuilder.newColumn("description", "Description").withOption('name', 'Description').withClass("none").renderWith(function (data, type, full) {
                             var html = full.description;
                             return html;

                         }),

                         DTColumnBuilder.newColumn(null).withClass("none").withOption('name', 'Download').renderWith(function (data, type, full) {
                             var html = "<table>";

                             angular.forEach(full.onlineExamWorkFilePath, function (item) {
                                 html = html + " <tr><td><i class='fas fa-download'>  Click <a href='" + item + "'>here</a> to download.</i></td></tr>";
                             });
                             html = html + "</table>";
                             return html;
                         })

                     ];

                      function createdRow(row, data, dataIndex) {
                             $compile(angular.element(row).contents())($scope);
                         }

                         $scope.getSavedOnlineExams = function () {
                                $scope.orderInstance.rerender();
                            };
    $scope.uploadOnlineExamWork = function (form) {

        if ($scope.onlineExamForm.$invalid) {
            angular.forEach($scope.onlineExamForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
            angular.element("[name='" + $scope.onlineExamForm.$name + "']").find('.ng-invalid:visible:first').focus();
        }

        if ($scope.onlineExamForm.$valid) {

            $http.post($scope.webApiUrl + 'student/SaveOnlineExamWork', JSON.stringify({
                apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, studentId: $scope.user.entityId,
                description: $scope.onlineExam.description,classId:$scope.user.classId,onlineExamId:$stateParams.onlineExamId,onlineExamTypeId:$stateParams.onlineExamTypeId

            })).success(function (result) {
                if (result.status == true) {
                    $scope.onlineExamWorkId = result.data;

                    if ($scope.dzMethods.getAllFiles().length > 0) {
                        $scope.dzMethods.processQueue();
                    }
                    else {
                        $scope.success("Answer Sheet has been uploaded Successfully", true);
                    $scope.onlineExam.description="";
                         $scope.getSavedOnlineExams();
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

