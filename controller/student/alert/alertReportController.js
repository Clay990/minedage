colorAdminApp.controller('studentAlertReportController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
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

    /*$http.get($scope.webApiUrl + 'shared/GetNoticeAlertCategories?apiKey=' + $scope.school.appKey + "&academicYearId=" + $scope.academicYear.academicYearId
             ).success(function (result) {
                 if (result.status == true) {
                     $scope.alertCategories = result.data;
                     $scope.alertCategories.unshift({ alertCategoryId: 0, alertCategoryName: 'All' })
                 }
                 else {
                     $scope.error(result.message, true);
                 }
             }).error(function (error, status) {
                 $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
             });
*/
    function getAlertReport(sSource, aoData, fnCallback, oSettings) {
      
        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.get($scope.webApiUrl + 'student/GetAlertReport?apiKey=' + $scope.school.appKey + '&studentId=' + $scope.user.entityId + "&academicYearId=" + $scope.academicYear.academicYearId +
            '&startDate=' + $scope.startDate + '&endDate=' + $scope.endDate + '&alertCategoryId=' + $scope.alertCategory.selectedCategory.alertCategoryId).success(function (result) {
                if (result.status == true) {
                    $scope.alertReport = result.data;
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
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getAlertReport)
    .withOption('processing', false)
    .withOption('oLanguage', {
        "sZeroRecords": "No Alert Found.",
    }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
    .withOption('serverSide', true)
    .withPaginationType('full_numbers')
    .withOption('createdRow', createdRow)
         .withOption('autoWidth', false)
    .withBootstrap()

    $scope.orderColumns = [

          DTColumnBuilder.newColumn("alertMessage", "Message").withClass("f-s-600 text-inverse").withOption('name', 'Message').renderWith(function (data, type, full) {
              var html = full.alertMessage;
              debugger;
              return html;

          }),

            DTColumnBuilder.newColumn("alertDate", "Date").withClass("f-s-600 text-inverse").withOption('name', 'Date').renderWith(function (data, type, full) {
                 var html =full.alertDate+" "+full.alertTime
                 return html;
            }),

    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getAlertReport = function () {
        $scope.orderInstance.rerender();
    };

    //$(document).ready(function () {
    //    $('[data-provide="datepicker"]').datepicker({
    //        todayHighlight: true,
    //        autoclose: true
    //    }).on('changeDate', function (e) {
    //        angular.element($(this)).triggerHandler('input');
    //    });
    //});
});

