colorAdminApp.controller('studentNoticeController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
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

  

    function getNoticeReport(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;
        $scope.draw = draw;
       $http.get($scope.webApiUrl + 'shared/GetNoticeReport?apiKey=' + $scope.school.appKey + '&loginEntityId=' + $scope.user.entityId+ '&loginRoleId=' + $scope.user.roleId + '&roleId=' + $scope.user.roleId+ "&academicYearId=" + $scope.academicYear.academicYearId +
                   '&startDate=' + $scope.startDate + '&endDate=' + $scope.endDate).success(function (result) {
                       if (result.status == true) {
                           $scope.noticeReport = result.data;
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
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getNoticeReport)
    .withOption('processing', false)
    .withOption('oLanguage', {
        "sZeroRecords": "No Notice Found.",
    }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
    .withOption('serverSide', true)
    .withPaginationType('full_numbers')
    .withOption('createdRow', createdRow)
         .withOption('autoWidth', false)
    .withBootstrap()

    $scope.orderColumns = [

               DTColumnBuilder.newColumn("description", "Description").withOption('name', 'Description').withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
                         var html = full.description;
                         return html;

                   }),

                       DTColumnBuilder.newColumn("noticeDate", "Date").withClass("f-s-600 text-inverse").withOption('name', 'Date').renderWith(function (data, type, full) {
                           return full.noticeDate;
                       }),
                       DTColumnBuilder.newColumn("noticeTime", "Time").withClass("f-s-600 text-inverse").withOption('name', 'Time').renderWith(function (data, type, full) {
                           return full.noticeTime;
                       }),
                        DTColumnBuilder.newColumn(null).withClass("none").withOption('name', 'Download File').renderWith(function (data, type, full) {
                         var html = "No File Found";

                                              if(full.filePath!=null){
                                                  html = "<table>";

                                                  html = html + " <tr><td><i class='fas fa-download m-r-5'> </i><a href='" + full.filePath + "'>Click Here</a> to download.</td></tr>";

                                       html = html + "</table>";

                                              }
                                             return html;
                               }),

    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getNoticeReport = function () {
        $scope.orderInstance.rerender();
    };
});

