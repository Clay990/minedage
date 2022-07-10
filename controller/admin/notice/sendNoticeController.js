colorAdminApp.controller('adminSendNoticeController', function ($scope, $rootScope, $http,$log, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile, $q) {

    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.isSelectedAll = false;
    $scope.isSelectedAllUser=false
    $scope.isByGroup = true;
    $scope.screenId = 801;
    $scope.userGroups;
    $scope.userGroup = { selectedGroup: { groupId: 0 },section:{sectionId:0} };
    $scope.search = { role:{roleId:0}};
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;
    $scope.userList = [];
    $scope.description="";
    Dropzone.autoDiscover = false;
     $scope.dzMethods = {};

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
                    url: $scope.webApiUrl + 'shared/ProcessFileNotice',
                    chunking: false,
                    autoProcessQueue: false,
                    uploadMultiple: false,
                    maxFiles: 1,
                    parallelUploads: 1,
                     maxFilesize: 100,
                     timeout:1000*60*10,
                    addRemoveLinks: true,
                    dictDefaultMessage: "Click here to upload file(s)"
                };


    //Handle events for dropzone
    //Visit http://www.dropzonejs.com/#events for more events
            $scope.dzCallbacks = {
                   'addedfile': function (file) {
                       if ($scope.dzMethods.getAllFiles().length > 1) {
                           $scope.error("We're sorry, but you can not upload more than 1 files.", true);
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
                       $scope.success("Notice has been sent Successfully", true);
                       $state.go("app.admin.notice.viewNotice");
                       $('#spinner').hide();
                   },
                   'error': function (file, xhr) {
                       $scope.error("An error occured uploading Assignment File. Verify the file size.", true);
                       $scope.dzMethods.removeFile(file);
                       $('#spinner').hide();
                   },

                'sending': function (file, xhr, formData) {
                    $('#spinner').show();
                        formData.append("isByGroup",$scope.isByGroup);
                        formData.append("description", $scope.description);
                        formData.append("selectedGroupRoleIds", $scope.selectedGroupRoleIds);
                        formData.append("selectedUserRoleIds", $scope.selectedUserRoleIds);
                        formData.append("adminId", $scope.user.entityId);
                        formData.append("academicYearId", $scope.academicYear.academicYearId);

                }
            };



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

    var i = -1;
    function getClassList(sSource, aoData, fnCallback, oSettings) {
         i = -1;
         $scope.isSelectedAll = false;
        var draw = aoData[0].value;
        $scope.draw = draw;

         $http.post($scope.webApiUrl + 'admin/GetRoleAlert', JSON.stringify({
                           apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId,screenId:$scope.screenId, adminId: $scope.user.entityId

                       })).success(function (result) {
                           if (result.status == true) {
                               $scope.roleAlert = result.data;
                               $scope.roleAlert.unshift({ roleId: 0, roleName: "User Type" });
                           }
                           else {
                               $scope.error(result.message, true);
                           }
                       }).error(function (error, status) {
                         $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
         });

         $scope.OnRoleChange = function () {
                    $http.post($scope.webApiUrl + 'admin/GetUserGroupList', JSON.stringify({
                        apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId,groupId:0,classId:0,sectionId:0,roleId:$scope.search.role.roleId, screenId: $scope.screenId, adminId: $scope.user.entityId

                    })).success(function (result) {

                        if (result.status == true) {
                             $scope.classList = result.data;
                             $scope.userGroups = angular.copy(result.data);
                             $scope.userGroups.unshift({ groupId: 0, groupName: "Select Group" });
                             if(result.data.length===0){
                                 $scope.userGroup.selectedGroup.groupId=0;
                             }


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

            $scope.getSections = function () {
               if($scope.school.isSectionApplicable && $scope.search.role.roleId===5){
                 $http.post($scope.webApiUrl + 'shared/GetSectionList', JSON.stringify({
                        apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, screenId: $scope.screenId, groupId: $scope.userGroup.selectedGroup.groupId

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

                   $scope.OnRoleChange();


    }


    $scope.classInstance = {};
    $scope.classOptions = DTOptionsBuilder.newOptions().withFnServerData(getClassList)
        .withOption('processing', false)
        .withOption('oLanguage', {
            "sZeroRecords": "No Class Found.",
        }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers')
        .withOption('headerCallback', function (header) {

                $compile(angular.element(header).contents())($scope);

        })
        .withOption('createdRow', classCreatedRow)
        .withOption('autoWidth', false)
        .withBootstrap()

    $scope.classColumns = [

       DTColumnBuilder.newColumn(null).withTitle('<div class="switcher checkbox-css"><input type="checkbox" ng-model="isSelectedAll" ng-click="toggleAll()" id="select-all" /><label for="select-all"></label></div>').notSortable()
                   .renderWith(function (data, type, full, meta) {
                       i = i + 1;
                       return '<div class="switcher checkbox-css"><input type="checkbox" id=checkbox_' + i + ' ng-model="classList['+i+'].isSelected" ng-click="toggleOne()" /><label for=checkbox_'+ i+ '></label></div>';
                   }),
  DTColumnBuilder.newColumn("groupName", "Group/Class").withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
           return full.groupName ;
        }),
    ];
    function classCreatedRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getClassList = function () {
        $scope.classInstance.rerender();
    };

    $scope.toggleAll = function () {
            angular.forEach($scope.classList, function (item, key) {
                item.isSelected = $scope.isSelectedAll;
            });
        }
        $scope.toggleOne = function () {
            if ($scope.classList.length === $scope.classList.filter(function (item) { return item.isSelected === true; }).length) {
                $scope.isSelectedAll = true;
            }
            else {
                $scope.isSelectedAll = false;
            }
        }
        $scope.toggleAllUser = function () {
                angular.forEach($scope.userList, function (item, key) {
                    item.isSelected = $scope.isSelectedAllUser ;
                });
            }
            $scope.toggleOneUser = function () {
                if ($scope.userList.length === $scope.userList.filter(function (item) { return item.isSelected === true; }).length) {
                    $scope.isSelectedAllUser = true;
                }
                else {
                    $scope.isSelectedAllUser = false;
                }
            }

         var j = -1;
    function getUsers(sSource, aoData, fnCallback, oSettings) {
           j = -1;
           $scope.isSelectedAllUser = false;
        var draw = aoData[0].value;
        $scope.draw = draw;
         if ($scope.userGroup.selectedGroup.groupId != 0 || $scope.search.role.roleId != 0) {

                $http.post($scope.webApiUrl + 'admin/GetUsers', JSON.stringify({
                    apiKey: $scope.school.appKey, adminId: $scope.user.entityId, userName: $scope.userName,groupId: $scope.userGroup.selectedGroup.groupId,
                     classId: 0,sectionId:$scope.userGroup.section.sectionId,
                     roleId:$scope.search.role.roleId,
                     academicYearId: $scope.academicYear.academicYearId

                })).success(function (result) {
            if (result.status == true) {
                $scope.userList = result.data;
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

    }

    $scope.orderInstance = {};
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getUsers)
        .withOption('processing', false)
        .withOption('oLanguage', {
            "sZeroRecords": "No User Found.",
        }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers')
         .withOption('headerCallback', function (header) {

           $compile(angular.element(header).contents())($scope);

                })
        .withOption('createdRow', studentCreatedRow)
        .withOption('autoWidth', false)
        .withBootstrap()

    $scope.orderColumns = [

        DTColumnBuilder.newColumn(null).withTitle('<div class="switcher checkbox-css"><input type="checkbox" ng-model="isSelectedAllUser" ng-click="toggleAllUser()" id="select-all-user" /><label for="select-all-user"></label></div>').notSortable()
                    .renderWith(function (data, type, full, meta) {
                                    j = j + 1;
                                    return '<div class="switcher checkbox-css"><input type="checkbox" id=checkbox_user_' + j + ' ng-model="userList['+j+'].isSelected" ng-click="toggleOneUser()" /><label for=checkbox_user_'+ j+ '</label></div>';
                                }),
        DTColumnBuilder.newColumn("groupName", "Name").withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
                    return full.fullName ;
                        }),
        DTColumnBuilder.newColumn("className", "Class").withClass("f-s-600 text-inverse").withTitle('Class').withOption('name', 'Class').renderWith(function (data, type, full) {
            return full.className+' '+(full.sectionName==null?'':full.sectionName);
        }),

    ];
    function studentCreatedRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getUsers = function () {
     if ($scope.userGroup.selectedGroup.groupId != 0) {
        $scope.orderInstance.rerender();
        }
         else{
              $scope.error("Please Select Class", true);
             }
    };

    function onSendNotice(buttonIndex) {

       $scope.selectedOption =buttonIndex;
        if (buttonIndex == 1) {
            if ($scope.isByGroup) {
                var selectedGroups = $scope.classList.filter(function (item) { return item.isSelected == true; });
                var groupIds = selectedGroups.map(function (obj) { return obj.groupId; }).join(', ');
                $scope.selectedGroupRoleIds = groupIds;
                if (groupIds == "") {
                    $scope.error("Please select any group", true);
                    return false;
                }
            }
            else {
                var selectedItems = $scope.userList.filter(function (item) { return item.isSelected == true; });
                var entityRoleIds = selectedItems.map(function (obj) { return obj.entityId + '|' + obj.roleId; }).join(', ');
                 $scope.selectedUserRoleIds =entityRoleIds;
                if (entityRoleIds == "") {
                    $scope.error("Please select any student", true);
                    return false;
                }
            }
            if ($scope.dzMethods.getAllFiles().length > 0) {
                $scope.dzMethods.processQueue();
            }
            else{

            $http.post($scope.webApiUrl + 'shared/ProcessNotice', JSON.stringify({
                            apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId,
                             entityId: $scope.user.entityId,roleId: $scope.user.roleId,
                             entityRoleIds, groupIds, isByGroup: $scope.isByGroup, description: $scope.description

                        })).success(function (result) {
                            if (result.status == true) {

                                $scope.success("Notice has been sent Successfully", true);
                                $state.reload("app.admin.notice.sendNotice");

                            }
                            else {
                                $scope.error(result.message, true);
                            }
                        }).error(function (error, status) {
                            $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
                        });

            }

        }
    }

    $scope.sendNotice = function () {
        if (app) {
            navigator.notification.confirm(
                'Are you sure to send this notice!',
                onSendNotice,
                'Please confirm',
                ['OK', 'CANCEL']
            );
        }
        else {
            var conf = (confirm('Are you sure to send this notice?')) ? 1 : 0;
            onSendNotice(conf);
        }
    }
});
