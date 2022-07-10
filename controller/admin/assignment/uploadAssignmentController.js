colorAdminApp.controller('adminUploadAssignmentController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile, $q) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.assignment = { assignmentDate: $scope.formatDate(new Date()), deadline: $scope.formatDate(new Date()), group: { groupId: 0},section:{sectionId:0}, student: { studentId: 0 } };
    $scope.assignmentId = 0;
    $scope.screenId = 260;
    Dropzone.autoDiscover = false;
    $scope.students =[];
    $scope.subjects =[];
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
        url: $scope.webApiUrl + 'admin/UploadAssignmentFiles',
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
            $scope.success("Assignment Files(s) has been uploaded Successfully", true);
            $state.go("app.admin.assignment.viewAssignment");
            $('#spinner').hide();
        },
        'error': function (file, xhr) {
            $scope.error("An error occured uploading Assignment File. Verify the file size.", true);
            $scope.dzMethods.removeFile(file);
            $('#spinner').hide();
        },
        'sending': function (file, xhr, formData) {
            if (formData.get("assignmentId") == null) {
                $('#spinner').show();
                formData.append("assignmentId", $scope.assignmentId);
                formData.append("studentId", $scope.assignment.student.studentId);
                formData.append("adminId", $scope.user.entityId);
                formData.append("academicYearId", $scope.academicYear.academicYearId);
            }
        }
    };


    //Apply methods for dropzone
    //Visit http://www.dropzonejs.com/#dropzone-methods for more methods
    $scope.dzMethods = {};

    $http.post($scope.webApiUrl + 'admin/GetClassList', JSON.stringify({
        apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, screenId: $scope.screenId, adminId: $scope.user.entityId

    })).success(function (result) {
        if (result.status == true) {
            $scope.userGroups = result.data;

        }
        else {
            $scope.error(result.message, true);
        }
    }).error(function (error, status) {
        $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
    });


 $scope.getSections = function () {
       if($scope.school.isSectionApplicable){
         $http.post($scope.webApiUrl + 'shared/GetSectionList', JSON.stringify({
                apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, screenId: $scope.screenId, groupId: $scope.assignment.group.groupId

            })).success(function (result) {

                if (result.status == true) {
                    $scope.userSections = result.data;
                    $scope.userSections.unshift({ sectionId: 0, sectionName: "Select Section" });
                }
                else {
                    $scope.error(result.message, true);
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
            });
       }
    }


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
    $scope.getSubjects = function () {
        $http.post($scope.webApiUrl + 'shared/GetClassSubjects', JSON.stringify({
            apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, classId: $scope.assignment.group.groupId
        })).success(function (result) {
            if (result.status == true) {
                $scope.subjects = result.data;
            }
            else {
                $scope.error(result.message, true);
            }
        }).error(function (error, status) {
            $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
        });
        $scope.getStudents();
    }

    $scope.getStudents = function () {
        $http.post($scope.webApiUrl + 'shared/GetClassStudents', JSON.stringify({
            apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, classId: $scope.assignment.group.groupId,sectionId: $scope.assignment.section.sectionId
        })).success(function (result) {
            if (result.status == true) {
                $scope.students = result.data;
                $scope.students.unshift({ studentId: 0, fullName: "Select Name" });
            }
            else {
                $scope.error(result.message, true);
            }
        }).error(function (error, status) {
            $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
        });
    }

    $scope.uploadAssignment = function (form) {
        if ($scope.assignmentForm.$invalid) {
            angular.forEach($scope.assignmentForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
            angular.element("[name='" + $scope.assignmentForm.$name + "']").find('.ng-invalid:visible:first').focus();
        }

        if ($scope.assignmentForm.$valid) {
            $http.post($scope.webApiUrl + 'admin/SaveAssignment', JSON.stringify({
                apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, adminId: $scope.user.entityId,
                assignmentDate: $scope.assignment.assignmentDate, deadline: $scope.assignment.deadline, classId: $scope.assignment.group.groupId,
                sectionId: $scope.assignment.section.sectionId,
                studentId: $scope.assignment.student.studentId,
                subjectId: $scope.assignment.subject.subjectId, description: $scope.assignment.description,
                 resourceLink: $scope.assignment.resourceLink
            })).success(function (result) {
                if (result.status == true) {
                    $scope.assignmentId = result.data;

                    if ($scope.dzMethods.getAllFiles().length > 0) {
                        $scope.dzMethods.processQueue();
                    }
                    else {
                        $scope.success("Assignment has been created Successfully", true);
                        $state.go("app.admin.assignment.viewAssignment");
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

