colorAdminApp.controller('adminViewOnlineExamWorkController', function ($scope, $rootScope, $http, $state,$stateParams, DTOptionsBuilder, DTColumnBuilder, $filter, $compile, $q) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    Dropzone.autoDiscover = false;
    $scope.onlineExamWorkId=0;
     $scope.studentOnlineExam = {examId:$stateParams.onlineExamId,examTypeId:$stateParams.onlineExamTypeId}
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

         function getSavedOnlineExamWork(sSource, aoData, fnCallback, oSettings) {
          var draw = aoData[0].value;
                 $scope.draw = draw;
                $http.get($scope.webApiUrl + 'shared/GetSavedOnlineExamWork?apiKey=' + $scope.school.appKey + '&entityId=' + $scope.user.entityId + '&roleId=' + $scope.user.roleId + "&academicYearId=" + $scope.academicYear.academicYearId +
                "&onlineExamId="+ $stateParams.onlineExamId+
                "&onlineExamTypeId="+ $stateParams.onlineExamTypeId+
                 "&studentId="+ $stateParams.studentId
                 ).success(function (result) {
                        if (result.status == true) {

                         $scope.onlineExamWork = result.data;
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
                     $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getSavedOnlineExamWork)
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

                         DTColumnBuilder.newColumn("studentName", "Name").withOption('name', 'Student Name').withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
                             var html = full.studentName;
                             return html;

                         }),


                         DTColumnBuilder.newColumn("description", "Description").withOption('name', 'Description').withClass("none").renderWith(function (data, type, full) {
                             var html = full.description;
                             return html;

                         }),
                           DTColumnBuilder.newColumn("createdDate", "Created Date").withClass("none").withOption('name', 'Created Date').renderWith(function (data, type, full) {
                                             return $filter('date')(full.createdDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy hh:mm a');
                                             return html;
                                         }),
                         DTColumnBuilder.newColumn(null).withClass("none").withOption('name', 'Download File').renderWith(function (data, type, full) {
                             var html = "<table>";

                             angular.forEach(full.onlineExamWorkFilePath, function (item) {
                                 html = html + " <tr><td><i class='fas fa-download'>  Click <a href='" + item + "'>here</a> to download Answer Sheet.</i></td></tr>";
                             });
                             html = html + "</table>";
                             return html;
                         })


                     ];

                      function createdRow(row, data, dataIndex) {
                             $compile(angular.element(row).contents())($scope);
                         }

                         $scope.getSavedOnlineExamWork = function () {
                                $scope.orderInstance.rerender();
                            };


          });

