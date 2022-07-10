colorAdminApp.controller('studentOnlineExamController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
   var startDate = new Date();
   $scope.endDate = $scope.formatDate(new Date());
   //startDate.setDate(new Date().getDate() - 7);
   $scope.startDate = $scope.formatDate(new Date());
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;


    function getOnlineExam(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.get($scope.webApiUrl + 'student/GetOnlineExams?apiKey=' + $scope.school.appKey + '&studentId=' + $scope.user.entityId + '&sectionId=' + $scope.user.sectionId +
        '&isSectionApplicable=' + $scope.school.isSectionApplicable +
        "&academicYearId=" + $scope.academicYear.academicYearId +
        "&subjectId=" + 0 +
            '&startDate=' + $scope.startDate +
             '&endDate=' + $scope.endDate).success(function (result) {
                if (result.status == true) {
                    $scope.onlineExam = result.data;
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
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getOnlineExam)
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

        DTColumnBuilder.newColumn("examDate", "Date").withOption('name', 'Date').renderWith(function (data, type, full) {
            return $filter('date')(full.examDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');
            return html;
        }),
        DTColumnBuilder.newColumn("subjectName", "Subject").withClass("f-s-600 text-inverse").withOption('name', 'Subject').renderWith(function (data, type, full) {
            var html = full.subjectName;
            return html;

        }),
       DTColumnBuilder.newColumn(null).withClass("f-s-600 text-inverse").withTitle('').notSortable()
       .renderWith(function (data, type, full, meta) {
            return '<button class="btn btn-success btn-icon btn-circle btn-sm" uib-tooltip="Upload Answer Sheet" ng-hide="canReply('+data.examStatus+')" ng-click="saveOnlineExamWork(' + data.onlineExamId+',' + data.onlineExamTypeId+')">' + ' <i class="fa fa-credit-card"></i>)</button>';
       }),

        DTColumnBuilder.newColumn("startTime", "Start Time").withOption('name', 'Start Time').withClass("none").renderWith(function (data, type, full) {
            return $filter('date')(full.startTime.replace('/Date(', '').replace(')/', ''), 'hh:mm a');
            return html;
        }),
         DTColumnBuilder.newColumn("endTime", "End Time").withOption('name', 'End Time').withClass("none").renderWith(function (data, type, full) {
                    return $filter('date')(full.endTime.replace('/Date(', '').replace(')/', ''), 'hh:mm a');
                    return html;
                }),
        DTColumnBuilder.newColumn("description", "Description").withOption('name', 'Description').withClass("none").renderWith(function (data, type, full) {
            var html = full.description;
            return html;

        }),
        DTColumnBuilder.newColumn(null).withClass("none").renderWith(function (data, type, full) {

            var html = "<table>";
             if (full.examStatus===1 && full.examDocuments!=null) {
                 angular.forEach(full.examDocuments, function (item) {
                html = html + " <tr><td><i class='fas fa-download'>  Click <a href='" + item.filePath +"'>here</a> to download Question Paper.</i></td></tr>";
            });
            }
             else if (full.examStatus === 2) {
              html = html + "<span class='label label-primary'>COMING SOON</span>";
             }
             else if (full.examStatus === 3){
                 html = html + "<span class='label label-danger'>ENDED</span>";
             }
            html = html + "</table>";
            return html;
        }),

        DTColumnBuilder.newColumn("examLink", "").withClass("none").renderWith(function (data, type, full) {
              var  html ='';
              if (full.examStatus===1 && full.examLink!=null && full.examLink!=' ') {
                         html = html + "<b>To Attend Exam<a href='" + full.examLink + "' target='_blank'> Click Here</a></b><br/><br/><span class='label label-primary'><b>Enter Student ID in Exam:"+$scope.user.entityId+"</b></span>";
                     }
                     else if (full.examStatus === 2) {
                         html = html + "<span class='label label-primary'>COMING SOON</span>";

                     }
                     else if (full.examStatus === 3){
                         html = html + "<span class='label label-danger'>ENDED</span>";
                     }
                     return html;
  })
    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getOnlineExam = function () {
        $scope.orderInstance.rerender();
    };

     $scope.saveOnlineExamWork = function (onlineExamId,onlineExamTypeId) {
            $state.go('app.student.saveOnlineExamWork', { onlineExamId: onlineExamId,onlineExamTypeId:onlineExamTypeId});
        }

        $scope.canReply = function (examStatus) {
                  if(examStatus===1){
                  return false;
                  }
                  else{
                   return true;
                  }
                }


});

