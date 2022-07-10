colorAdminApp.controller('studentAttendanceReportController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
  $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    var startDate = new Date();
        $scope.endDate = $scope.formatDate(new Date());
        startDate.setDate(new Date().getDate() - 7);
        $scope.startDate = $scope.formatDate(startDate);
    $scope.alertCategories;
    $scope.alertCategory = { selectedCategory: { alertCategoryId: 0 } };
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;

   /* $http.get($scope.webApiUrl + 'shared/GetAttendanceAlertCategories?apiKey=' + $scope.school.appKey + "&academicYearId=" + $scope.academicYear.academicYearId
        ).success(function (result) {
            if (result.status == true) {
                $scope.alertCategories = result.data;
                $scope.alertCategories.unshift({ alertCategoryId: 0, alertCategoryName: "All" });

                // $scope.alertCategories.unshift({ })
            }
            else {
                $scope.error(result.message, true);
            }
        }).error(function (error, status) {
            $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
        });*/

    function getAttendanceReport(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.get($scope.webApiUrl + 'student/GetAttendanceReport?apiKey=' + $scope.school.appKey + '&studentId=' + $scope.user.entityId + "&academicYearId=" + $scope.academicYear.academicYearId +
            '&startDate=' + $scope.startDate + '&endDate=' + $scope.endDate + '&alertCategoryId=' + $scope.alertCategory.selectedCategory.alertCategoryId).success(function (result) {
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

    $scope.orderInstance = {};
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getAttendanceReport)
        .withOption('processing', false)
        .withOption('oLanguage', {
            "sZeroRecords": "No Attendance Found.",
        }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers')
        .withOption('createdRow', createdRow)
        .withOption('autoWidth', false)
        .withBootstrap()

    $scope.orderColumns = [

        DTColumnBuilder.newColumn("alertCategoryName", "Category").withClass("f-s-600 text-inverse").withOption('name', 'Category').renderWith(function (data, type, full) {
            var html = full.alertCategoryName;
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
        $scope.orderInstance.rerender();
    };
});

