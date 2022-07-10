colorAdminApp.controller('feeStructureController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
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
    $scope.finalFeeStructure = [];

    function getFeeStructure(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.get($scope.webApiUrl + 'student/GetFeeStructure?apiKey=' + $scope.school.appKey + '&studentId=' + $scope.user.entityId + "&academicYearId=" + $scope.academicYear.academicYearId
           ).success(function (result) {
                if (result.status == true) {
                    $scope.feeStructure = result.data;
                    if ($scope.feeStructure.length > 0) {
                        $scope.finalFeeStructure = [];
                        var startDate = $scope.feeStructure[0].startDate;
                        var endDate = $scope.feeStructure[0].endDate;
                        $scope.finalFeeStructure.push({ startDate: startDate, endDate: endDate, details:[] });
                        var i = 0;
                        angular.forEach($scope.feeStructure, function (item) {
                            if(item.startDate===startDate && item.endDate===endDate)
                            {
                                $scope.finalFeeStructure[i].details.push({ feeTypeName: item.feeTypeName, feeParticularName: item.feeParticularName, feeAmount: item.feeAmount });
                            }
                            else
                            {
                                i = i + 1;
                                startDate = item.startDate;
                                endDate = item.endDate;
                                $scope.finalFeeStructure.push({ startDate: startDate, endDate: endDate, details: [] });
                                $scope.finalFeeStructure[i].details.push({ feeTypeName: item.feeTypeName, feeParticularName: item.feeParticularName, feeAmount: item.feeAmount });
                            }
                        });

                        var records = {
                            'draw': draw,
                            'data': $scope.finalFeeStructure
                        };
                        fnCallback(records);
                    }
                }
                else {
                    $scope.error(result.message, true);
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
            });

    }

    $scope.orderInstance = {};
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getFeeStructure)
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

        //DTColumnBuilder.newColumn("feeTypeName", "Type").withOption('name', 'Type').withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
        //    var html = full.feeTypeName;
        //    return html;

        //}),
        DTColumnBuilder.newColumn("startDate", "Start Date").withClass("f-s-600 text-inverse").withOption('name', 'Start Date').renderWith(function (data, type, full) {
            return $filter('date')(full.startDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');
            return html;
        }),
        DTColumnBuilder.newColumn("endDate", "End Date").withClass("f-s-600 text-inverse").withOption('name', 'End Date').renderWith(function (data, type, full) {
            return $filter('date')(full.endDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');
            return html;
        }),
        //DTColumnBuilder.newColumn("feeParticularName", "Particular").withClass("none").withOption('name', 'Particular').renderWith(function (data, type, full) {
        //    var html = full.feeParticularName;
        //    return html;

        //}),
        //DTColumnBuilder.newColumn("feeAmount", "Amount").withClass("none").withOption('name', 'Amount').renderWith(function (data, type, full) {
        //    var html = full.feeAmount;
        //    return html;
        //}),
      
      DTColumnBuilder.newColumn(null).withClass("none").withOption('name', 'Details').renderWith(function (data, type, full) {
          var html = "<table class='table table-striped table-bordered'><thead><tr class='bg-inverse text-white f-w-600'><td>Fee Type</td><td>Particular</td><td>Amount</td></tr></thead>";
          angular.forEach(full.details, function (item) {
              html = html + " <tr><td>" + item.feeTypeName + "</td><td>" + item.feeParticularName + "</td><td>" + item.feeAmount + "</td></tr>";
          });
          html = html + "</table>";
          return html;
      }),
    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getFeeStructure = function () {
        $scope.orderInstance.rerender();
    };
});

