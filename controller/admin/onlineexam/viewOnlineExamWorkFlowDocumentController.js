colorAdminApp.controller('adminViewOnlineExamWorkFlowDocumentController', function ($scope, $rootScope, $http, $state,$stateParams, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.screenId = 1003;
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;

    function getOnlineExamWorkFlowDocuments(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.get($scope.webApiUrl + 'shared/GetOnlineWorkFlowDocuments?apiKey=' + $scope.school.appKey + "&studentId="+ $stateParams.studentId
        +"&onlineExamResultId="+ $stateParams.onlineExamResultId
        +"&onlineExamId="+ $stateParams.onlineExamId
        +"&onlineExamTypeId="+ $stateParams.onlineExamTypeId
         + "&academicYearId=" + $scope.academicYear.academicYearId
         ).success(function (result) {
                if (result.status == true) {
                    $scope.onlineExamDocuments = result.data;
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
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getOnlineExamWorkFlowDocuments)
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

        DTColumnBuilder.newColumn("", "Exam").withClass("f-s-600 text-inverse").withOption('name', 'Exam Doc').renderWith(function (data, type, full) {
            var html = "<table>";

            angular.forEach(full.onlineExamFilePath, function (item) {
               if (item.filePath != null && item.filePath != ' ')
                            {
                              html = html +" <tr><td>Click <a href='" + item.filePath + "'>here</a></td></tr>";
                            }
                         else {
                                  html = html +"<b>No Document Found</b>"
                              }
            });
            html = html + "</table>";
            return html;
        }),

 DTColumnBuilder.newColumn("", "Student").withClass("f-s-600 text-inverse").withOption('name', 'Work Doc').renderWith(function (data, type, full) {
            var html = "<table>";
            angular.forEach(full.onlineExamWorkFilePath, function (item) {
               if (item.filePath != null && item.filePath != ' ')
                            {
                              html = html + " <tr><td>Click <a href='" + item.filePath + "'>here</a></td></tr>";
                            }
                         else {
                                  html = html +"<b>No Document Found</b>"
                              }
            });
            html = html + "</table>";
            return html;
        }),

        DTColumnBuilder.newColumn("", "Teacher").withClass("f-s-600 text-inverse").withOption('name', 'Result Doc').renderWith(function (data, type, full) {
                    var html = "<table>";
                    angular.forEach(full.onlineExamResultFilePath, function (item) {
                       if (item.filePath != null && item.filePath != ' ')
                                    {
                                      html = html + " <tr><td>Click <a href='" + item.filePath + "'>here</a></td></tr>";
                                    }
                                 else {
                                          html = html +"<b>No Document Found</b>"
                                      }
                    });
                    html = html + "</table>";
                    return html;
                })


    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
});

