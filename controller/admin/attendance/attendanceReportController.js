colorAdminApp.controller('adminAttendanceReportController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    var startDate = new Date();
    startDate.setDate(new Date().getDate() - 7);

     $scope.search = { startDate: $scope.formatDate(startDate), endDate: $scope.formatDate(new Date()),class: { groupId: 0 }, group: { groupId: 0 },role: { roleId: 0 }, alertCategory: { alertCategoryId: 0 } };
        $scope.screenId = 173;
      $scope.userGroups=[];


    $http.get($scope.webApiUrl + 'shared/GetAttendanceAlertCategories?apiKey=' + $scope.school.appKey + "&academicYearId=" + $scope.academicYear.academicYearId
      ).success(function (result) {
            if (result.status == true) {
                $scope.alertCategories = result.data;
                // $scope.alertCategories.unshift({ })
                $scope.alertCategories.unshift({ alertCategoryId: 0, alertCategoryName: "Select Category" });

            }
            else {
                $scope.error(result.message, true);
            }
        }).error(function (error, status) {
            $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
        });

    function getAttendanceReport(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;

        $http.get($scope.webApiUrl + 'admin/GetAttendanceReport?apiKey=' + $scope.school.appKey + '&roleId=' + $scope.search.role.roleId+ '&classId=' + $scope.search.class.groupId+ '&groupId=' + $scope.search.group.groupId+ '&adminId=' + $scope.user.entityId + "&academicYearId=" + $scope.academicYear.academicYearId +
            '&startDate=' + $scope.search.startDate + '&endDate=' + $scope.search.endDate + '&alertCategoryId=' + $scope.search.alertCategory.alertCategoryId).success(function (result) {
                if (result.status == true) {

                    $scope.attendanceReport = result.data;
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

    $scope.adminInstance = {};
    $scope.adminOptions = DTOptionsBuilder.newOptions().withFnServerData(getAttendanceReport)
        .withOption('processing', false)
        .withOption('oLanguage', {
            "sZeroRecords": "No Attendance Found.",
        }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers')
        .withOption('createdRow', createdRow)
        .withOption('autoWidth', false)
        .withBootstrap()

    $scope.adminColumns = [

   DTColumnBuilder.newColumn("fullName", "Name").withClass("f-s-600 text-inverse").withOption('name', 'Name').renderWith(function (data, type, full) {
                var html = full.fullName;
                return html;
            }),
        DTColumnBuilder.newColumn("alertCategoryName", "Category").withClass("f-s-600 text-inverse").withOption('name', 'Category').renderWith(function (data, type, full) {
            var html = full.alertCategoryName;
            return html;
        }),
          DTColumnBuilder.newColumn("groupName", "Group/Class").withClass("f-s-600 text-inverse").withOption('name', 'Class').renderWith(function (data, type, full) {
                        var html = full.groupName+' '+(full.sectionName==null?'':full.sectionName);
                        return html;
                    }),
        DTColumnBuilder.newColumn("attendanceDate", "Date").withClass("f-s-600 text-inverse").withOption('name', 'Date').renderWith(function (data, type, full) {
            return full.attendanceDate;
        }),
        DTColumnBuilder.newColumn("attendanceTime", "Time").withClass("f-s-600 text-inverse").withOption('name', 'Time').renderWith(function (data, type, full) {
            return full.attendanceTime;
        }),


    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getAttendanceReport = function () {
        $scope.adminInstance.rerender();
    };

            $http.post($scope.webApiUrl + 'admin/GetRoleAttendance', JSON.stringify({
                             apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId,screenId:$scope.screenId, adminId: $scope.user.entityId

                         })).success(function (result) {
                             if (result.status == true) {
                                 $scope.roleAttendance = result.data;
                                 $scope.roleAttendance.unshift({ roleId: 0, roleName: "Select User Type" });
                             }
                             else {
                                 $scope.error(result.message, true);
                             }
                         }).error(function (error, status) {
                             $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
                             });

        $http.post($scope.webApiUrl + 'admin/GetClassList', JSON.stringify({
            apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, screenId: $scope.screenId, adminId: $scope.user.entityId

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
                            $scope.userGroups = result.data;
                            $scope.userGroups.unshift({ groupId: 0, groupName: "Select Group" });
                        }
                        else {
                            $scope.error(result.message, true);
                        }
                    }).error(function (error, status) {
                        $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
                    });
};
});

