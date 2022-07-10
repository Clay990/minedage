colorAdminApp.controller('adminTimeTableController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.date = $scope.formatDate(new Date());

     
        $scope.draw;
        $scope.column;
        $scope.order;
        $scope.start;
        $scope.length;
        $scope.searchValue;
        function getOrders(sSource, aoData, fnCallback, oSettings) {

            var draw = aoData[0].value;
            $scope.draw = draw;
        

            $http.get($scope.webApiUrl + 'admin/GetTimeTable?apiKey=' + $scope.school.appKey + '&adminId=' + $scope.user.entityId + "&academicYearId=" + $scope.academicYear.academicYearId +
                '&date=' + $scope.date+ "&academicYearEndDate=" + $scope.academicYear.endDate).success(function (result) {
                if (result.status == true) {
                    $scope.timeTable = result.data;
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
        $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getOrders)
        .withOption('processing', false)
        .withOption('oLanguage', {
            "sZeroRecords": "No Time Table Found.",
        }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers')
        .withOption('createdRow', createdRow)
             .withOption('autoWidth', false)
        .withBootstrap()

        $scope.orderColumns = [

                DTColumnBuilder.newColumn("subjectName", "Subject").withOption('name', 'Subject').withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
                    var html = full.subjectName;
                    return html;
                  
            }),
            DTColumnBuilder.newColumn("className", "Class").withOption('name', 'Class').withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
                var html = full.className;
                return html;

            }),
                DTColumnBuilder.newColumn("teacherName", "Teacher").withOption('name', 'Teacher').renderWith(function (data, type, full) {
                    var html = full.teacherName;
                    return html;
                }),
                DTColumnBuilder.newColumn("start", "Start").withClass("none").withOption('name', 'Start').renderWith(function (data, type, full) {
                    return $filter('date')(full.start.replace('/Date(', '').replace(')/', ''), "MMM dd, yyyy 'at' hh:mm a");
                }),
                DTColumnBuilder.newColumn("end", "End").withClass("none").withTitle('End').withOption('name', 'End').renderWith(function (data, type, full) {
                    return $filter('date')(full.end.replace('/Date(', '').replace(')/', ''), "MMM dd, yyyy 'at' hh:mm a");
                }),
                

        ];
        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }
        $scope.getTimeTables = function () {
            $scope.orderInstance.rerender();
        };
        angular.element(document).ready(function () {
            //if ($('#data-table-responsive').length !== 0) {
            //    $('#data-table-responsive').DataTable({
            //        responsive: true
            //    });
            //}
        });
        
});

