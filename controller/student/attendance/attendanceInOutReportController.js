colorAdminApp.controller('studentAttendanceInOutReportController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
   $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
   var startDate = new Date();
       $scope.endDate = $scope.formatDate(new Date());
       startDate.setDate(new Date().getDate() - 7);
       $scope.startDate = $scope.formatDate(startDate);
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;

    function getAttendanceInOutReport(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.get($scope.webApiUrl + 'student/GetAttendanceInOutReport?apiKey=' + $scope.school.appKey + '&studentId=' + $scope.user.entityId + "&academicYearId=" + $scope.academicYear.academicYearId +
            '&startDate=' + $scope.startDate + '&endDate=' + $scope.endDate).success(function (result) {
                if (result.status == true) {
                    $scope.inOutReport = result.data;
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
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getAttendanceInOutReport)
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

        DTColumnBuilder.newColumn("date", "Date").withOption('name', 'Date').renderWith(function (data, type, full) {
            return full.date;
           
        }),
        DTColumnBuilder.newColumn("startTime", "In Time").withOption('name', 'In Time').renderWith(function (data, type, full) {
            return full.startTime;
        
        }),
        DTColumnBuilder.newColumn("endTime", "Out Time").withOption('name', 'Out Time').renderWith(function (data, type, full) {
            return full.endTime;
          
        }),

    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getAttendanceInOutReport = function () {
        $scope.orderInstance.rerender();
    };
});

