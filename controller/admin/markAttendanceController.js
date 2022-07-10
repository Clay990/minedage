colorAdminApp.controller('adminMarkAttendanceController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
      $scope.userscreen = JSON.parse(window.localStorage.getItem("userscreen"));
      $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
      $scope.school = JSON.parse(window.localStorage.getItem("school"));
      $scope.isMarkAttendance = $scope.userscreen.filter(function (item) { return item.screenId == 153; }).length > 0;
      $scope.isSendAbsent = $scope.userscreen.filter(function (item) { return item.screenId == 154; }).length > 0;
    $scope.startDate = $scope.formatDate(new Date());
    $scope.endDate = $scope.formatDate(new Date());
    $scope.userGroups;
    $scope.search = { class: { groupId: 0 }, group: { groupId: 0 },role:{roleId:0},section:{sectionId:0} };
    $scope.alertCategoryId = 6;
    $scope.screenId = 153;
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;
    $scope.isSelectedAll = false;
    $scope.absentReport = [];
      

     $http.post($scope.webApiUrl + 'admin/GetRoleAttendance', JSON.stringify({
              apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId,screenId:$scope.screenId, adminId: $scope.user.entityId

          })).success(function (result) {
              if (result.status == true) {
                  $scope.roleAttendance = result.data;
                  $scope.roleAttendance.unshift({ roleId: 0, roleName: "User Type" });
              }
              else {
                  $scope.error(result.message, true);
              }
          }).error(function (error, status) {
              $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
              });


   $http.post($scope.webApiUrl + 'admin/GetClassList', JSON.stringify({
           apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId,screenId:$scope.screenId, adminId: $scope.user.entityId

       })).success(function (result) {
           if (result.status == true) {

               $scope.userClasses = result.data;
               $scope.userClasses.unshift({ groupId: 0, groupName: "Select Class" });
           }
           else {
               $scope.error(result.message, true);
           }
       }).error(function (error, status) {
           $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
           });


            $scope.OnRoleChange = function () {

                 $http.post($scope.webApiUrl + 'admin/GetUserGroupList', JSON.stringify({
                                        apiKey: $scope.school.appKey,classId:0,groupId:0,sectionId:0, academicYearId: $scope.academicYear.academicYearId,screenId:$scope.screenId,roleId:$scope.search.role.roleId, adminId: $scope.user.entityId

                          })).success(function (result) {

                              if (result.status == true) {

                                  $scope.userGroups = result.data
                                  $scope.userGroups.unshift({ groupId: 0, groupName: "Select Group" });
                              }
                              else {
                                  $scope.error(result.message, true);
                              }
                          }).error(function (error, status) {
                              $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
                          });
                    };



 $scope.getSections = function () {

           if($scope.school.isSectionApplicable){
             $http.post($scope.webApiUrl + 'shared/GetSectionList', JSON.stringify({
                    apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, screenId: $scope.screenId, groupId: $scope.search.class.groupId

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





    var i = -1;
    function getAbsentList(sSource, aoData, fnCallback, oSettings) {
    i = -1;

    $scope.isSelectedAll = false;
        var draw = aoData[0].value;
        $scope.draw = draw;
      if ($scope.search.group.groupId != 0 || $scope.search.class.groupId != 0) {

           var draw = aoData[0].value;

               $http.get($scope.webApiUrl + 'admin/GetAbsentReport?apiKey=' + $scope.school.appKey + '&adminId=' + $scope.user.entityId
               +'&roleId=' + $scope.search.role.roleId  +'&groupId=' + $scope.search.group.groupId
               +'&classId=' + $scope.search.class.groupId
               +'&sectionId=' + $scope.search.section.sectionId +
               "&academicYearId=" + $scope.academicYear.academicYearId +
                   '&startDate=' + $scope.startDate + '&endDate=' + $scope.endDate).success(function (result) {
                       if (result.status == true) {
                           $scope.absentReport = result.data;
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
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getAbsentList)
        .withOption('processing', false)
        .withOption('oLanguage', {
            "sZeroRecords": "No Student Found.",
        }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers')
        .withOption('headerCallback', function (header) {


                $compile(angular.element(header).contents())($scope);

        })
        .withOption('createdRow', createdRow)
        .withOption('autoWidth', false)
        .withBootstrap()

    $scope.orderColumns = [

        DTColumnBuilder.newColumn(null).withTitle('<div class="switcher checkbox-css"><input type="checkbox" ng-model="isSelectedAll" ng-click="toggleAll()" id="select-all" /><label for="select-all"></label></div>').notSortable()
                .renderWith(function (data, type, full, meta) {
                    i = i + 1;

                    return '<div class="switcher checkbox-css"><input type="checkbox" id=checkbox_' + i + ' ng-model="absentReport['+i+'].isSelected" ng-click="toggleOne()" /><label for=checkbox_'+ i + ' </label></div>';
                }),
        DTColumnBuilder.newColumn("groupName", "Name").withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
            return full.fullName ;
                }),
        DTColumnBuilder.newColumn("groupName", "Class/Group").withClass("f-s-600 text-inverse").withOption('name', 'EnrollmentNo').renderWith(function (data, type, full) {
            return full.groupName +' '+(full.sectionName==null?'':full.sectionName);
        }),

    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
        
    }
    $scope.getAbsentList = function () {

     if ($scope.search.group.groupId != 0 || $scope.search.class.groupId != 0) {
        $scope.orderInstance.rerender();
     }
     else{
         $scope.error("Please Select Class", true);
     }
    };

    $scope.toggleAll = function () {
        angular.forEach($scope.absentReport, function (item, key) {
            item.isSelected = $scope.isSelectedAll;
        });
    }
    $scope.toggleOne = function () {
        if ($scope.absentReport.length === $scope.absentReport.filter(function (item) { return item.isSelected === true; }).length) {
            $scope.isSelectedAll = true;
        }
        else {
            $scope.isSelectedAll = false;
        }
    }


    function onMarkAttendance(buttonIndex) {

       if (buttonIndex == 1) {
             var selectedItems = $scope.absentReport.filter(function (item) { return item.isSelected == true; });
             var entityRoleIds = selectedItems.map(function (obj) { return obj.entityId + '|' + obj.roleId; }).join(', ');
            if (entityRoleIds == "") {
                $scope.error("Please select any user", true);
                return false;
            }
            else {

                $http.post($scope.webApiUrl + 'admin/MarkAttendance', JSON.stringify({
                    apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId,isSendAbsentAlert:$scope.isSendAbsentAlert,
                    roleId:$scope.search.role.roleId,
                    groupId:$scope.search.group.groupId,classId:$scope.search.class.groupId,sectionId:$scope.search.section.sectionId,
                    alertCategoryId: $scope.alertCategoryId, adminId: $scope.user.entityId, entityRoleIds

                })).success(function (result) {
                    if (result.status == true) {
                    if($scope.isSendAbsentAlert){
                     $scope.success("Attendance and Absent Alert has been processed Successfully", true);
                    }
                    else{
                        $scope.success("Attendance has been processed Successfully", true);
                    }

                        $scope.orderInstance.rerender();
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
      var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
      $scope.markAttendance = function (isSendabsnt) {
        $scope.isSendAbsentAlert=isSendabsnt;
            if (app) {
                navigator.notification.confirm(
                    'Are you sure',
                    onMarkAttendance,
                    'Please confirm',
                    ['OK', 'CANCEL']
                );
            }
            else {
                var conf = (confirm('Are you sure')) ? 1 : 0;
                onMarkAttendance(conf);
            }
        }
});