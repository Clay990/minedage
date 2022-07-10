colorAdminApp.controller('adminSendAbsentAlertController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.userscreen = JSON.parse(window.localStorage.getItem("userscreen"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.isMarkAttendance = $scope.userscreen.filter(function (item) { return item.screenId == 153; }).length > 0;
    $scope.isSendAbsent = $scope.userscreen.filter(function (item) { return item.screenId == 154; }).length > 0;
    $scope.startDate = $scope.formatDate(new Date());
    $scope.endDate = $scope.formatDate(new Date());
    $scope.userGroups;
    $scope.userGroup = { selectedGroup: { groupId: 0 } };
    $scope.alertCategoryId = 6;
    $scope.screenId = 154;
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;
    $scope.isSelectedAll = false;
    $scope.absentReport = [];
      

    $http.post($scope.webApiUrl + 'admin/GetClassList', JSON.stringify({
        apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, screenId: $scope.screenId, employeeId: $scope.user.entityId

    })).success(function (result) {
        if (result.status == true) {
            $scope.userGroups = result.data;
            $scope.userGroups.unshift({ groupId: 0, groupName: "Select Class" });

        }
        else {
            $scope.error(result.message, true);
        }
    }).error(function (error, status) {
        $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
    });

    var i = -1;
    function getAbsentList(sSource, aoData, fnCallback, oSettings) {
    i = -1;
    $scope.isSelectedAll = false;
        var draw = aoData[0].value;
        $scope.draw = draw;
      if ($scope.userGroup.selectedGroup.groupId != 0) {
        $http.post($scope.webApiUrl + 'admin/GetAbsentReportForAlert', JSON.stringify({
            apiKey: $scope.school.appKey, adminId: $scope.user.entityId, userName: $scope.userName, classId: $scope.userGroup.selectedGroup.groupId, academicYearId: $scope.academicYear.academicYearId

        })).success(function (result) {
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
                    return '<div class="switcher checkbox-css"><input type="checkbox" id=checkbox_' + i + ' ng-model="absentReport['+i+'].isSelected" ng-click="toggleOne()" /><label for=checkbox_'+ i+ '</label></div>';
                }),
                DTColumnBuilder.newColumn("groupName", "Name").withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
                return full.fullName ;
                    }),

        DTColumnBuilder.newColumn("groupName", "Class").withClass("f-s-600 text-inverse").withOption('name', 'EnrollmentNo').renderWith(function (data, type, full) {
            return full.groupName;
        }),

    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
        
    }
    $scope.getAbsentList = function () {
     if ($scope.userGroup.selectedGroup.groupId != 0) {
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


    function onSendAbsentAlert(buttonIndex,isSaveAttendance) {

       if (buttonIndex == 1) {
            var selectedItems = $scope.absentReport.filter(function (item) { return item.isSelected == true; });
            var entityRoleIds = selectedItems.map(function (obj) { return obj.entityId + '|' + obj.roleId; }).join(', ');
            if (entityRoleIds == "") {
                $scope.error("Please select any student", true);
                return false;
            }
            else {

                $http.post($scope.webApiUrl + 'admin/SendAbsentAlert', JSON.stringify({
                    apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId,isSaveAttendance,classId:$scope.userGroup.selectedGroup.groupId, adminId: $scope.user.entityId, entityRoleIds

                })).success(function (result) {
                    if (result.status == true) {
                    if(isSaveAttendance){
                        $scope.success("Absent Alert and Attendance has been processed Successfully", true);
                    }
                    else{
                        $scope.success("Absent Alert has been sent Successfully", true);
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
        $scope.sendAbsentAlert = function (isSaveAttendance) {
            if (app) {
                navigator.notification.confirm(
                    'Are you sure',
                    onSendAbsentAlert,
                    'Please confirm',
                    ['OK', 'CANCEL']
                );
            }
            else {
                var conf = (confirm('Are you sure')) ? 1 : 0;
                onSendAbsentAlert(conf,isSaveAttendance);
            }
        }
});