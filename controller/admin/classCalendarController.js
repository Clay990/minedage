colorAdminApp.controller('adminClassCalendarController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
   $scope.endDate = $scope.formatDate(new Date());

         $scope.startDate = $scope.formatDate(new Date());
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;


    function getClassCalendar(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.get($scope.webApiUrl + 'shared/GetClassCalendar?apiKey=' + $scope.school.appKey + '&entityId=' + $scope.user.entityId + '&roleId=' + $scope.user.roleId +  "&academicYearId=" + $scope.academicYear.academicYearId +
            '&startDate=' + $scope.startDate + '&endDate=' + $scope.endDate).success(function (result) {
                if (result.status == true) {
                    $scope.classCalendar = result.data;
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
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getClassCalendar)
        .withOption('processing', false)
        .withOption('oLanguage', {
            "sZeroRecords": "No Record Found.",
        }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers')
        .withOption('createdRow', createdRow)
        .withOption('autoWidth', false)
        .withBootstrap()

    $scope.orderColumns = [
DTColumnBuilder.newColumn("className", "Class").withOption('name', 'Class').renderWith(function (data, type, full) {
                           var html = full.className+'-'+full.sectionName;
                           return html;

                       }),
        DTColumnBuilder.newColumn("date", "Date").withClass("f-s-600 text-inverse").withOption('name', 'Date').renderWith(function (data, type, full) {
            return $filter('date')(full.date.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');
            return html;
        }),
         DTColumnBuilder.newColumn("periodName", "Period").withOption('name', 'Period').renderWith(function (data, type, full) {
                   var html = full.periodName;
                   return html;

               }),
        
        DTColumnBuilder.newColumn("subjectName", "Subject").withOption('name', 'Subject').renderWith(function (data, type, full) {
            var html = full.subjectName;
            return html;

        }),
        DTColumnBuilder.newColumn("teacherName", "Teacher").withClass("none").withOption('name', 'Teacher').renderWith(function (data, type, full) {
                    var html = full.teacherName;
                    return html;

                }),
              DTColumnBuilder.newColumn("description", "Description").withClass("none").renderWith(function (data, type, full) {
                    var html = full.description;
                    return html;

                }),
DTColumnBuilder.newColumn("startTime", "Start Time").withClass("none").renderWith(function (data, type, full) {
                    var html = full.startTime;
                    return html;

                }),
        DTColumnBuilder.newColumn("endTime", "End Time").withClass("none").renderWith(function (data, type, full) {
                    var html = full.endTime;
                    return html;

                })

    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getClassCalendar = function () {
        $scope.orderInstance.rerender();
    };

});
