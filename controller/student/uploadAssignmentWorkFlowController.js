colorAdminApp.controller('uploadAssignmentWorkFlowController', function ($scope, $rootScope, $http, $state,$stateParams, DTOptionsBuilder, DTColumnBuilder, $filter, $compile, $q) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.screenId = 260;
    Dropzone.autoDiscover = false;
    $scope.assignmentWorkFlowId=0;
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
        url: $scope.webApiUrl + 'shared/UploadAssignmentWorkFlowFiles',
        autoProcessQueue: false,
        maxFiles: 3,
        parallelUploads: 3,
        maxFilesize: 25,
        addRemoveLinks: true,
        dictDefaultMessage: "Click here to upload file(s)"
    };


    //Handle events for dropzone
    //Visit http://www.dropzonejs.com/#events for more events
    $scope.dzCallbacks = {
        'addedfile': function (file) {

            if ($scope.dzMethods.getAllFiles().length > 4) {
                $scope.error("We're sorry, but you can not upload more than 4 files.", true);
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
            $scope.success("Assignment Work Flow Files(s) has been uploaded Successfully", true);
            $scope.getSavedAssignmentFlows();
            $scope.dzMethods.removeFile(file);
            $scope.assignment.description = "";
             $scope.assignmentForm.$setPristine();
             $scope.assignmentForm.$setUntouched();
            $('#spinner').hide();
        },
        'error': function (file, xhr) {
            $scope.error("An error occured uploading Assignment Work Flow File. Verify the file size.", true);
            $scope.dzMethods.removeFile(file);
            $('#spinner').hide();
        },
        'sending': function (file, xhr, formData) {
            $('#spinner').show();
                formData.append("assignmentWorkFlowId",  $scope.assignmentWorkFlowId);
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

         function getSavedAssignmentFlows(sSource, aoData, fnCallback, oSettings) {
          var draw = aoData[0].value;
                 $scope.draw = draw;
                $http.get($scope.webApiUrl + 'shared/GetSavedAssignmentWorkFlow?apiKey=' + $scope.school.appKey + '&entityId=' + $scope.user.entityId +'&roleId=' + $scope.user.roleId + "&academicYearId=" + $scope.academicYear.academicYearId +
                "&assignmentId="+ $stateParams.assignmentId+ "&assignmentTypeId="+ $stateParams.assignmentTypeId ).success(function (result) {
                        if (result.status == true) {

                            $scope.assignmentWorkFlow = result.data;
                            var records = {
                                'draw': draw,
                                'recordsTotal': result.recordsTotal,
                                'recordsFiltered': result.recordsFiltered,
                                'data': result.data.filter(function (item) {
                                 return item.roleId === 5;
                            })
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

          function getTeacherAssignmentFlows(sSource, aoData, fnCallback, oSettings) {
                   var draw = aoData[0].value;
                          $scope.draw = draw;
                         $http.get($scope.webApiUrl + 'shared/GetSavedAssignmentWorkFlow?apiKey=' + $scope.school.appKey + '&entityId=' + $scope.user.entityId +'&roleId=' + $scope.user.roleId + "&academicYearId=" + $scope.academicYear.academicYearId +
                         "&assignmentId="+ $stateParams.assignmentId ).success(function (result) {
                                 if (result.status == true) {

                                     $scope.assignmentWorkFlow = result.data;
                                     var records = {
                                         'draw': draw,
                                         'recordsTotal': result.recordsTotal,
                                         'recordsFiltered': result.recordsFiltered,
                                         'data': result.data.filter(function (item) {
                                                                            return item.roleId === 2;
                                                                        })
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
                     $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getSavedAssignmentFlows)
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

                      DTColumnBuilder.newColumn("fullName", "Name").withClass("f-s-600 text-inverse").withOption('name', 'Name').renderWith(function (data, type, full) {
                             var html = full.fullName;
                             return html;

                         }),
                         DTColumnBuilder.newColumn("description", "Description").withClass("f-s-600 text-inverse").withOption('name', 'Description').renderWith(function (data, type, full) {
                             var html = full.description;
                             return html;

                         }),
                            DTColumnBuilder.newColumn("createdDate", "Created Date").withClass("none").withOption('name', 'Created Date').renderWith(function (data, type, full) {
                                    return $filter('date')(full.createdDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy hh:mm a');
                                    return html;
                                }),
                         DTColumnBuilder.newColumn(null).withClass("none").withOption('name', 'Download File').renderWith(function (data, type, full) {
                             var html = "<table>";

                             angular.forEach(full.assignmentWorkFlowFilePath, function (item) {
                                 html = html + " <tr><td><i class='fas fa-download'>  Click <a href='" + item + "'>here</a> to download.</i></td></tr>";
                             });
                             html = html + "</table>";
                             return html;
                         })

                     ];

                      function createdRow(row, data, dataIndex) {
                             $compile(angular.element(row).contents())($scope);
                         }

$scope.teacherInstance = {};
                     $scope.teacherOptions = DTOptionsBuilder.newOptions().withFnServerData(getTeacherAssignmentFlows)
                         .withOption('processing', false)
                         .withOption('oLanguage', {
                             "sZeroRecords": "No Record Found.",
                         }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
                         .withOption('serverSide', true)
                         .withPaginationType('full_numbers')
                         .withOption('createdRow', teacherCreatedRow)
                         .withOption('autoWidth', false)
                         .withBootstrap()

                     $scope.teacherColumns = [

                DTColumnBuilder.newColumn("fullName", "Name").withClass("f-s-600 text-inverse").withOption('name', 'Name').renderWith(function (data, type, full) {
                             var html = full.fullName;
                             return html;

                         }),
                         DTColumnBuilder.newColumn("description", "Description").withClass("f-s-600 text-inverse").withOption('name', 'Description').renderWith(function (data, type, full) {
                             var html = full.description;
                             return html;

                         }),

                         DTColumnBuilder.newColumn(null).withClass("none").withOption('name', 'Download File').renderWith(function (data, type, full) {
                             var html = "<table>";

                             angular.forEach(full.assignmentWorkFlowFilePath, function (item) {
                                 html = html + " <tr><td><i class='fas fa-download'>  Click <a href='" + item + "'>here</a> to download.</i></td></tr>";
                             });
                             html = html + "</table>";
                             return html;
                         })

                     ];

                      function teacherCreatedRow(row, data, dataIndex) {
                             $compile(angular.element(row).contents())($scope);
                         }

                         $scope.getSavedAssignmentFlows = function () {
                                $scope.orderInstance.rerender();
                            };
    $scope.uploadAssignmentWorkFlow = function (form) {

        if ($scope.assignmentForm.$invalid) {
            angular.forEach($scope.assignmentForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
            angular.element("[name='" + $scope.assignmentForm.$name + "']").find('.ng-invalid:visible:first').focus();
        }

        if ($scope.assignmentForm.$valid) {

            $http.post($scope.webApiUrl + 'shared/SaveAssignmentWorkFlow', JSON.stringify({
                apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, entityId: $scope.user.entityId,roleId: $scope.user.roleId,
                description: $scope.assignment.description,assignmentId:$stateParams.assignmentId,assignmentTypeId:$stateParams.assignmentTypeId

            })).success(function (result) {
                if (result.status == true) {
                    $scope.assignmentWorkFlowId = result.data;

                    if ($scope.dzMethods.getAllFiles().length > 0) {
                        $scope.dzMethods.processQueue();
                    }
                    else {
                        $scope.success("Assignment Work Flow has been uploaded Successfully", true);
                        $scope.getSavedAssignmentFlows();
                        $scope.assignment.description = "";
                         $scope.assignmentForm.$setPristine();
                         $scope.assignmentForm.$setUntouched();
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

