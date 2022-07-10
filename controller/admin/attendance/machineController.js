colorAdminApp.controller('machineListController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.screenId = 91;
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;





    function getMachineList(sSource, aoData, fnCallback, oSettings) {

            var draw = aoData[0].value;
        $scope.draw = draw;

            $http.post($scope.webApiUrl + 'admin/GetMachineList', JSON.stringify({
                apiKey: $scope.school.appKey,
                academicYearId: $scope.academicYear.academicYearId

            })).success(function (result) {

                if (result.status == true) {
                    $scope.machineList = result.data;
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
        $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getMachineList)
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

           DTColumnBuilder.newColumn(null).withTitle('Machine').notSortable()
                           .renderWith(function (data, type, full, meta) {
                               return '<button class="btn btn-success" ng-click="viewDetail(' + data.machineMasterId + ')">'  + full.machineId + '</button>';
                           }),

            DTColumnBuilder.newColumn("machineStatus", "Status").withClass("f-s-600 text-inverse").withOption('name', 'Status').renderWith(function (data, type, full) {
                var html = full.machineStatus;
                return html;
            }),

        ];

        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }
    $scope.getMachineList = function () {
          $scope.orderInstance.rerender();
        };

    $scope.viewDetail = function (id) {
        $state.go('app.admin.attendance.viewMachineDetail', { machineMasterId: id });
    }


});

