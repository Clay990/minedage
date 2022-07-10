colorAdminApp.controller('adminUploadOnlineExamController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile, $q) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.onlineExam = { onlineExamDate: $scope.formatDate(new Date()), startTime: new Date(),endTime: new Date(), publishDate: $scope.formatDate(new Date()), publishTime: new Date(), group: { groupId: 0},section:{sectionId:0},student: [] };
    $scope.onlineExamIds = "";
    $scope.screenId = 1001;
    Dropzone.autoDiscover = false;

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
        url: $scope.webApiUrl + 'admin/UploadOnlineExamFiles',
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
            $scope.success("Online Exam Files(s) has been uploaded Successfully", true);
            $state.go("app.admin.onlineExam.viewOnlineExam");
            $('#spinner').hide();
        },
        'error': function (file, xhr) {
            $scope.error("An error occured uploading Online Exam File. Verify the file size.", true);
            $scope.dzMethods.removeFile(file);
            $('#spinner').hide();
        },
        'sending': function (file, xhr, formData) {

                $('#spinner').show();
                 var studentIds = $scope.onlineExam.student.map(function (obj) { return obj.studentId; }).join(',');
                 formData.append("onlineExamIds", $scope.onlineExamIds);
                formData.append("studentIds", studentIds);
                formData.append("adminId", $scope.user.entityId);
                formData.append("academicYearId", $scope.academicYear.academicYearId);

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
                     apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, screenId: $scope.screenId, groupId: $scope.onlineExam.group.groupId

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


   // capture callback
         var captureAudioSuccess = function(mediaFiles) {
             var i, mediaFile, len;
             try
             {
             for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                 mediaFile = mediaFiles[i];
                 //alert(path);
                  var audioFile = new File(mediaFile.name, mediaFile.localURL, mediaFile.type,
                   mediaFile.lastModifiedDate, mediaFile.size);
                   var reader = new FileReader();
                   reader.onload = function(e) {
                       var blob = new Blob([new Uint8Array(e.target.result)], {type: audioFile.type });
                       blob.name = mediaFile.name;

                       $scope.dzMethods.getDropzone().addFile(blob);
                                                        $scope.dzOptions.maxFiles = $scope.dzOptions.maxFiles - 1;
                   };
                   reader.readAsArrayBuffer(audioFile);

             }
             }
             catch(ex)
             {
             alert(ex.message);
             }
         };

 $scope.getSubjects = function () {
        $http.post($scope.webApiUrl + 'shared/GetClassSubjects', JSON.stringify({
            apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, classId: $scope.onlineExam.group.groupId
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

$scope.queryStudents = function (query) {

            var results = query ? $scope.students.filter(function (item) { return item.fullName.toLowerCase().indexOf(query.toLowerCase()) === 0; }) : $scope.students,
                    deferred;

            return results;
        };
    $scope.getStudents = function () {
        $http.post($scope.webApiUrl + 'shared/GetClassStudents', JSON.stringify({
            apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, classId: $scope.onlineExam.group.groupId,sectionId: $scope.onlineExam.section.sectionId
        })).success(function (result) {
            if (result.status == true) {
                $scope.students = result.data;
                //$scope.students.unshift({ studentId: 0, fullName: "Select Name" });
            }
            else {
                $scope.error(result.message, true);
            }
        }).error(function (error, status) {
            $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
        });
    }

    $scope.uploadOnlineExam = function (form) {

        if ($scope.onlineExamForm.$invalid) {
            angular.forEach($scope.onlineExamForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
            angular.element("[name='" + $scope.onlineExamForm.$name + "']").find('.ng-invalid:visible:first').focus();
        }

        if ($scope.onlineExamForm.$valid) {
        if($scope.dzMethods.getAllFiles().length==0 && ($scope.onlineExam.onlineExamLink==null || $scope.onlineExam.onlineExamLink==''))
                {
                $scope.error("Please upload exam files(s) or enter the exam link.", true);
                return;
                }
         var studentIds = $scope.onlineExam.student.map(function (obj) { return obj.studentId; }).join(',');
            $http.post($scope.webApiUrl + 'admin/SaveOnlineExam', JSON.stringify({
                apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, adminId: $scope.user.entityId,
                onlineExamDate: $scope.onlineExam.onlineExamDate,classId: $scope.onlineExam.group.groupId,
                sectionId: $scope.onlineExam.section.sectionId,
                studentIds: studentIds,
                subjectId: $scope.onlineExam.subject.subjectId, description: $scope.onlineExam.description,
                onlineExamLink: $scope.onlineExam.onlineExamLink, maxMark: $scope.onlineExam.maxMark,
                startTime:$scope.onlineExam.startTime, endTime:$scope.onlineExam.endTime,
                publishDate: $scope.onlineExam.publishDate,
                publishTime:$scope.onlineExam.publishTime
            })).success(function (result) {
                if (result.status == true) {
                    $scope.onlineExamId = result.data;

                    if ($scope.dzMethods.getAllFiles().length > 0) {
                        $scope.dzMethods.processQueue();
                    }
                    else {
                        $scope.success("Online Exam has been created Successfully", true);
                        $state.go("app.admin.onlineExam.viewOnlineExam");
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

