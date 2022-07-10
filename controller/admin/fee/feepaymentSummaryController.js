colorAdminApp.controller('feepaymentSummaryController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.search = { startDate: $scope.formatDate(new Date()), endDate:$scope.formatDate(new Date()),feeParticular:{feeParticularId:0},paymentMode:{paymentModeId:0}};
    $scope.screenId = 210;


 $scope.getTotal = function(item){

        for(var i = 0; i < item.length; i++){
              $scope.totalPaidAmount += item[i].paidAmount;
              $scope.totalDueAmount += item[i].dueAmount;
        }
        return;
    }


    function getFeePaymentSummary(sSource, aoData, fnCallback, oSettings) {
    var draw = aoData[0].value;

        $http.post($scope.webApiUrl + 'admin/GetFeePaymentSummary', JSON.stringify({
                   apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId,
                   adminId:$scope.user.entityId,
                   startDate : $scope.search.startDate,endDate: $scope.search.endDate,
                   feeParticularId:$scope.search.feeParticular.feeParticularId,
                   paymentModeId:$scope.search.paymentMode.paymentModeId

               })).success(function (result) {
                if (result.status == true) {
                    $scope.feePaymentSummary = result.data;
                    $scope.totalPaidAmount=0.0;
                     $scope.totalDueAmount=0.0;
                    $scope.getTotal($scope.feePaymentSummary);
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
    $scope.adminOptions = DTOptionsBuilder.newOptions().withFnServerData(getFeePaymentSummary)

        .withOption('processing', false)
        .withOption('oLanguage', {
            "sZeroRecords": "No Payment Found.",
        }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers')
        .withOption('createdRow', createdRow)
        .withOption('autoWidth', false)
        .withBootstrap()


    $scope.adminColumns = [

        DTColumnBuilder.newColumn("feeDate", "Date").withClass("f-s-600 text-inverse").withOption('name', 'Date').renderWith(function (data, type, full) {
            return full.feeDate;

        }),
         DTColumnBuilder.newColumn("paidAmount", "Paid Amount").withClass("f-s-600 text-inverse").withOption('name', 'PaidAmount').renderWith(function (data, type, full) {
                    return full.paidAmount;

                }),
         DTColumnBuilder.newColumn("dueAmount", "Due Amount").withClass("f-s-600 text-inverse").withOption('name', 'DueAmount').renderWith(function (data, type, full) {
                    return full.dueAmount;

                }),
         DTColumnBuilder.newColumn("paymentMode", "Mode").withClass("f-s-600 text-inverse").withOption('name', 'Mode').renderWith(function (data, type, full) {
                    return full.paymentMode;

                }),
      DTColumnBuilder.newColumn("academicYearName", "Academic Year").withClass("f-s-600 text-inverse").withOption('name', 'Name').renderWith(function (data, type, full) {
                var html = full.academicYearName;
                return html;
            }),

    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getFeePaymentSummary = function () {
        $scope.adminInstance.rerender();

    };


   $http.post($scope.webApiUrl + 'admin/GetFeeParticular', JSON.stringify({
           apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId

       })).success(function (result) {
           if (result.status == true) {
               $scope.feeParticular = result.data;
               $scope.feeParticular.unshift({ feeParticularId: 0, feeParticularName: "Select Particular" });
           }
           else {
               $scope.error(result.message, true);
           }
       }).error(function (error, status) {
           $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
           });

       $http.post($scope.webApiUrl + 'admin/GetPaymentMode', JSON.stringify({
           apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId

       })).success(function (result) {
           if (result.status == true) {

               $scope.paymentMode = result.data;
               $scope.paymentMode.unshift({ paymentModeId: 0, paymentModeName: "Select Payment Mode" });
           }
           else {
               $scope.error(result.message, true);
           }
       }).error(function (error, status) {
           $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
           });

});

