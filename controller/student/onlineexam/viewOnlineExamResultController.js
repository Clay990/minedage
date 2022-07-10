colorAdminApp.controller('viewOnlineExamResultController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
     var startDate = new Date();
      startDate.setDate(new Date().getDate() - 7);
    $scope.search = { startDate:$scope.formatDate(startDate), endDate: $scope.formatDate(new Date()),subject: { subjectId: 0 } };
    $scope.screenId = 1003;
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;



            $http.post($scope.webApiUrl + 'shared/GetClassSubjects', JSON.stringify({
                apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, classId: $scope.user.classId
            })).success(function (result) {
                if (result.status == true) {
                    $scope.subjects = result.data;
                }
                else {
                    $scope.error(result.message, true);
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
            });




    function getOnlineExamResult(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.post($scope.webApiUrl + 'shared/ViewOnlineExamResult',JSON.stringify({apiKey:$scope.school.appKey, entityId:$scope.user.entityId
        , roleId:$scope.user.roleId
        , academicYearId:$scope.academicYear.academicYearId
        , startDate:$scope.search.startDate ,endDate:$scope.search.endDate
        , classId:$scope.user.classId
        , sectionId:0,subjectId:$scope.search.subject.subjectId
        })).success(function (result) {
                if (result.status == true) {
                    $scope.onlineExamResult = result.data;
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
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getOnlineExamResult)
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

DTColumnBuilder.newColumn("fullName", "Name").withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
            var html = full.fullName;
            return html;

        }),
              DTColumnBuilder.newColumn("marks", "MO/MM").withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
                var html = (full.obtainedMarks==null?'NA':full.obtainedMarks)+'/'+full.maxMark;
                return html;

            }),


    DTColumnBuilder.newColumn("subjectName", "Subject").withOption('name', 'Subject').withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
            var html = full.subjectName;
            return html;

        }),

        DTColumnBuilder.newColumn("className", "Class").withClass("none").renderWith(function (data, type, full) {
                    var html = full.className+' '+(full.sectionName==null?'':full.sectionName);
                    return html;

                }),

 DTColumnBuilder.newColumn("examDate", "Date").withClass("none").withOption('name', 'Date').renderWith(function (data, type, full) {
                    return $filter('date')(full.examDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');
                    return html;
                }),




        DTColumnBuilder.newColumn("startTime", "Start Time").withClass("none").withOption('name', 'Start Time').renderWith(function (data, type, full) {
            return $filter('date')(full.startTime.replace('/Date(', '').replace(')/', ''), 'hh:mm a');
            return html;
        }),
         DTColumnBuilder.newColumn("endTime", "End Time").withClass("none").withOption('name', 'End Time').renderWith(function (data, type, full) {
                    return $filter('date')(full.endTime.replace('/Date(', '').replace(')/', ''), 'hh:mm a');
                    return html;
                }),
        DTColumnBuilder.newColumn("examDescription", "Description").withOption('name', 'Description').withClass("none").renderWith(function (data, type, full) {
            var html = full.examDescription;
            return html;

        }),

        DTColumnBuilder.newColumn("maxMark", "Max Marks").withOption('name', 'Max Marks').withClass("none").renderWith(function (data, type, full) {
                    var html = full.maxMark;
                    return html;

                }),

    DTColumnBuilder.newColumn("obtainedMarks", "Obtained Marks").withOption('name', 'Obtained Marks').withClass("none").renderWith(function (data, type, full) {
                    var html = full.obtainedMarks;
                    return html;

                }),

                DTColumnBuilder.newColumn("workDescription", "Work Description").withOption('name', 'Work Description').withClass("none").renderWith(function (data, type, full) {
                                    var html = full.workDescription;
                                    return html;

                                }),
  DTColumnBuilder.newColumn("resultDescription", "Remark").withOption('name', 'Remark').withClass("none").renderWith(function (data, type, full) {
                                    var html = full.resultDescription;
                                    return html;

                                }),




          DTColumnBuilder.newColumn(null).withClass("f-s-600 text-inverse").withTitle('').notSortable()
                               .renderWith(function (data, type, full, meta) {

                                    return '<button class="btn btn-success btn-circle btn-sm" uib-tooltip="View Documents" ng-hide="canViewDocument('+ data.onlineExamResultId+')" onclick="viewOnlineExamResultDocument(' + data.onlineExamId+',' + data.onlineExamTypeId+','+ data.studentId+','+ data.onlineExamResultId+')">' + 'View Documents</button>';

                               })



    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getOnlineExamResult = function () {
        $scope.orderInstance.rerender();
    };

     $scope.viewOnlineResultDocument = function (onlineExamId,onlineExamTypeId,studentId,onlineExamResultId) {

                           $state.go('app.student.onlineExam.viewOnlineExamWorkFlowDocument', { onlineExamId: onlineExamId,onlineExamTypeId:onlineExamTypeId,studentId:studentId,onlineExamResultId:onlineExamResultId});
                       }

    $scope.canViewDocument = function (onlineExamResultId) {
                     if(onlineExamResultId!=null && onlineExamResultId!=0 ){
                     return false;
                     }
                     else{
                      return true;
                     }
                   }
   });

   function viewOnlineExamResultDocument(onlineExamId,onlineExamTypeId,studentId,onlineExamResultId) {
         angular.element(document.getElementById('data-table-responsive')).scope().viewOnlineResultDocument(onlineExamId,onlineExamTypeId,studentId,onlineExamResultId);
     }
