colorAdminApp.controller('adminViewOnlineExamStudentController', function ($scope, $rootScope, $http, $state,$stateParams, DTOptionsBuilder, DTColumnBuilder, $filter, $compile, $q) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    Dropzone.autoDiscover = false;
    $scope.onlineExamWorkId=0;

    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

         function getOnlineExamStudent(sSource, aoData, fnCallback, oSettings) {
          var draw = aoData[0].value;
                 $scope.draw = draw;
                $http.get($scope.webApiUrl + 'shared/GetOnlineExamStudent?apiKey=' + $scope.school.appKey + '&entityId=' + $scope.user.entityId +
                 '&roleId=' + $scope.user.roleId +
                  "&academicYearId=" + $scope.academicYear.academicYearId +
                  "&isSectionApplicable=" + $scope.school.isSectionApplicable +
                  "&onlineExamId="+ $stateParams.onlineExamId+"&onlineExamTypeId="+ $stateParams.onlineExamTypeId ).success(function (result) {
                        if (result.status == true) {
                            $scope.onlineExamId = $stateParams.onlineExamId;
                            $scope.onlineExamTypeId = $stateParams.onlineExamTypeId;
                         $scope.onlineExamStudent = result.data;
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
                     $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getOnlineExamStudent)
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
            DTColumnBuilder.newColumn(null).withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
                      var html = "";

                      if(full.isExamAttended===true){
                      html= html+"<span class='btn btn-circle label label-primary'>P</span>"
                      }
                    else{
                    html= html+"<span class='btn btn-circle label label-danger'>A</span>";
                    }
                      return html;

                  }),
                         DTColumnBuilder.newColumn(null).withClass("f-s-600 text-inverse").withTitle('').notSortable()
                           .renderWith(function (data, type, full, meta) {
                                return '<button class="btn btn-success btn-icon btn-circle btn-sm" uib-tooltip="View Answer Sheet" ng-click="viewOnlineExamWork(' + data.studentId+',' + $scope.onlineExamId +',' + $scope.onlineExamTypeId +')">' + ' <i class="fa fa-eye"></i>)</button>';

                           }),
                          DTColumnBuilder.newColumn(null).withClass("f-s-600 text-inverse").withTitle('').notSortable()
                            .renderWith(function (data, type, full, meta) {
                                 return '<button class="btn btn-success btn-icon btn-circle btn-sm" uib-tooltip="Upload Result" ng-click="uploadOnlineExamResult(' + $scope.onlineExamId +',' + $scope.onlineExamTypeId +',' + data.studentId+','+ data.classId+')">' + ' <i class="fa fa-upload"></i>)</button>';

                            })
                     ];

                      function createdRow(row, data, dataIndex) {
                             $compile(angular.element(row).contents())($scope);
                         }

                         $scope.getOnlineExamStudent = function () {
                                $scope.orderInstance.rerender();
                            };

           $scope.viewOnlineExamWork = function (studentId,onlineExamId,onlineExamTypeId) {
                        $state.go('app.admin.onlineExam.viewOnlineExamWork', { onlineExamId: onlineExamId,onlineExamTypeId:onlineExamTypeId,studentId:studentId});
                    }
           $scope.uploadOnlineExamResult = function (onlineExamId,onlineExamTypeId,studentId,classId) {
                        $state.go('app.admin.onlineExam.onlineExamWorkResult', { onlineExamId: onlineExamId, onlineExamTypeId: onlineExamTypeId,studentId:studentId,classId:classId});
                    }

          });

