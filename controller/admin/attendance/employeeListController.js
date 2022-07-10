colorAdminApp.controller('employeeListController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.search = { role: { roleId: 0 },group: { groupId: 0 } };
    $scope.screenId = 130;
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;

 $http.post($scope.webApiUrl + 'admin/GetEmployeeRole', JSON.stringify({
           apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId,screenId:$scope.screenId, adminId: $scope.user.entityId

       })).success(function (result) {
           if (result.status == true) {
               $scope.roleEmp = result.data;
               $scope.roleEmp.unshift({ roleId: 0, roleName: "User Type" });
           }
           else {
               $scope.error(result.message, true);
           }
       }).error(function (error, status) {
           $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
           });

        $scope.OnRoleChange = function () {

               $http.post($scope.webApiUrl + 'admin/GetUserGroupList', JSON.stringify({
                           apiKey: $scope.school.appKey,roleId:$scope.search.role.roleId,groupId:0,classId:0,sectionId:0, academicYearId: $scope.academicYear.academicYearId,screenId:$scope.screenId, adminId: $scope.user.entityId

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

    function getEmployeeList(sSource, aoData, fnCallback, oSettings) {

            var draw = aoData[0].value;
        $scope.draw = draw;
        if ($scope.search.group.groupId != 0) {
            $http.post($scope.webApiUrl + 'admin/GetEmployeeList', JSON.stringify({
                apiKey: $scope.school.appKey, adminId: $scope.user.entityId,
                empName: $scope.empName, groupId: $scope.search.group.groupId,roleId: $scope.search.role.roleId, academicYearId: $scope.academicYear.academicYearId

            })).success(function (result) {

                if (result.status == true) {
                    $scope.employeeList = result.data;
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
        $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getEmployeeList)
            .withOption('processing', false)
            .withOption('oLanguage', {
                "sZeroRecords": "No Student Found.",
            }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
            .withOption('serverSide', true)
            .withPaginationType('full_numbers')
            .withOption('createdRow', createdRow)
            .withOption('autoWidth', false)
            .withBootstrap()

        $scope.orderColumns = [

           DTColumnBuilder.newColumn(null).withTitle('Name').withClass("f-s-600 text-inverse").notSortable()
                           .renderWith(function (data, type, full, meta) {
                               return '<button class="btn btn-success" ng-click="viewDetail(' + data.employeeId + ')">'  + full.fullName + '</button>';
                           }),

            DTColumnBuilder.newColumn("groupName", "Group").withClass("f-s-600 text-inverse").withOption('name', 'Group').renderWith(function (data, type, full) {
                var html = full.groupName;
                return html;
            }),

DTColumnBuilder.newColumn("phoneNumber", "Phone").withClass("f-s-600 text-inverse").withOption('name', 'Phone').renderWith(function (data, type, full) {
                var html = full.phoneNumber;
                return html;
            }),

        ];

        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }
    $scope.getEmployeeList = function () {

        if ($scope.search.group.groupId != 0) {
            $scope.orderInstance.rerender();
        }
        else{
            $scope.error("Please Select Group", true);
        }
        };

    $scope.viewDetail = function (id) {
        $state.go('app.admin.attendance.viewEmployeeDetail', { employeeId: id });
    }


});

