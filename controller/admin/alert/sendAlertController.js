colorAdminApp.controller('sendAlertController', function ($scope, $rootScope, $http,$log, $state,$stateParams, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.isSelectedAll = false;
    $scope.isSelectedAllStudent = false;
    $scope.isByGroup = true;
    $scope.screenId = 189;
    $scope.userGroups;
    $scope.userGroup = { selectedGroup: { groupId: 0 },section:{sectionId:0}};
    $scope.search = { role:{roleId:0}};
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;
    $scope.appMessage = "";
    $scope.studentList = [];
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
 var j = -1;
    function getUsers(sSource, aoData, fnCallback, oSettings) {
j = -1;
$scope.isSelectedAllStudent = false;
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

                $scope.studentList = result.data;
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

    $scope.studentListInstance = {};
    $scope.studentListOptions = DTOptionsBuilder.newOptions().withFnServerData(getUsers)
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

    $scope.studentListColumns = [

        DTColumnBuilder.newColumn(null).withTitle('<div class="switcher checkbox-css"><input type="checkbox" ng-model="isSelectedAllStudent" ng-click="toggleAllStudent()" id="select-all-user" /><label for="select-all-user"></label></div>').notSortable()
            .renderWith(function (data, type, full, meta) {
                            j = j + 1;
                                    
                            return  '<div class="switcher checkbox-css"><input type="checkbox" id=checkbox_user_' + j + ' ng-model="studentList['+j+'].isUserSelected" ng-click="toggleOneStudent()" /><label for=checkbox_user_'+ j+ '></label></div>';
                        }),
        DTColumnBuilder.newColumn("groupName", "Name").withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
            return full.fullName ;
                }),
        DTColumnBuilder.newColumn("className", "Class").withClass("f-s-600 text-inverse").withTitle('Class/Group').withOption('name', 'Class').renderWith(function (data, type, full) {

            return full.roleId===5 ? full.className+' '+ full.sectionName :  full.groupName;
        }),

    ];
    function studentCreatedRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getUsers = function () {
     if ($scope.userGroup.selectedGroup.groupId != 0 || $scope.search.role.roleId != 0) {
        $scope.studentListInstance.rerender();
        }
    };
  $scope.toggleAllStudent = function () {

            angular.forEach($scope.studentList, function (data, key) {

                data.isUserSelected = $scope.isSelectedAllStudent;
            });
        }
        $scope.toggleOneStudent = function () {

           if ($scope.studentList.length === $scope.studentList.filter(function (item) { return item.isUserSelected === true; }).length) {
                $scope.isSelectedAllStudent = true;
            }
            else {
                $scope.isSelectedAllStudent = false;
            }
        }


    function onSendAlert(buttonIndex) {

        if (buttonIndex == 1) {
            if ($scope.isByGroup) {
                var selectedGroups = $scope.classList.filter(function (item) { return item.isSelected == true; });
                var groupIds = selectedGroups.map(function (obj) { return obj.groupId; }).join(', ');
                if (groupIds == "") {
                    $scope.error("Please select any group", true);
                    return false;
                }
            }
            else {
                var selectedItems = $scope.studentList.filter(function (item) { return item.isUserSelected == true; });
                var entityRoleIds = selectedItems.map(function (obj) { return obj.entityId + '|' + obj.roleId; }).join(', ');
                if (entityRoleIds == "") {
                    $scope.error("Please select any student", true);
                    return false;
                }
            }

            $http.post($scope.webApiUrl + 'admin/SendAlert', JSON.stringify({
                apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, adminId: $scope.user.entityId, entityRoleIds, groupIds, isByGroup: $scope.isByGroup, message: $scope.appMessage,
                alertTypeId:$stateParams.alertTypeId,

            })).success(function (result) {
                if (result.status == true) {

                    $scope.success("Alert has been sent Successfully", true);
                    $state.go("app.admin.alert.alertReport");

                }
                else {
                    $scope.error(result.message, true);
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
            });
        }
    }
    var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
    $scope.sendAlert = function () {
        if (app) {
            navigator.notification.confirm(
                'Are you sure to send this message!',
                onSendAlert,
                'Please confirm',
                ['OK', 'CANCEL']
            );
        }
        else {
            var conf = (confirm('Are you sure to send this message?')) ? 1 : 0;
            onSendAlert(conf);
        }
    }
});
