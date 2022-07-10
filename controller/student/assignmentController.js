colorAdminApp.controller('assignmentController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
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


    function getAssignment(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.get($scope.webApiUrl + 'student/GetAssignments?apiKey=' + $scope.school.appKey + '&studentId=' + $scope.user.entityId + '&sectionId=' + $scope.user.sectionId + '&isSectionApplicable=' + $scope.school.isSectionApplicable + "&academicYearId=" + $scope.academicYear.academicYearId +
            '&startDate=' + $scope.startDate + '&endDate=' + $scope.endDate).success(function (result) {
                if (result.status == true) {
                    $scope.assignment = result.data;
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
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getAssignment)
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

        DTColumnBuilder.newColumn("assignmentDate", "Date").withOption('name', 'Date').renderWith(function (data, type, full) {
            return $filter('date')(full.assignmentDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');
            return html;
        }),
        DTColumnBuilder.newColumn("subjectName", "Subject").withClass("f-s-600 text-inverse").withOption('name', 'Subject').renderWith(function (data, type, full) {
            var html = full.subjectName;
            return html;

        }),
       DTColumnBuilder.newColumn(null).withClass("f-s-600 text-inverse").withTitle('').notSortable()
       .renderWith(function (data, type, full, meta) {
            return '<button class="btn btn-success btn-icon btn-circle btn-sm">' + ' <i class="fa fa-credit-card"></i>'+ (data.totalAssignmentWork>0 ?'<span class="label-upper">'+ "√"+'</span>' : '') +'</button>';

       }),
      DTColumnBuilder.newColumn(null).withClass("f-s-600 text-inverse").withTitle('').notSortable()
      .renderWith(function (data, type, full, meta) {
       return '<button class="btn btn-success btn-icon btn-circle btn-sm">' + ' <i class="fas fa-question"></i>'+ (data.totalQuestionAnswer>0 ?'<span class="label-upper">'+ data.totalQuestionAnswer+'</span>' : '') +'</button>';

      }),
        DTColumnBuilder.newColumn("deadline", "Deadline").withOption('name', 'Deadline').withClass("none").renderWith(function (data, type, full) {
            return $filter('date')(full.deadline.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');
            return html;
        }),
        DTColumnBuilder.newColumn("description", "Description").withOption('name', 'Description').withClass("none").renderWith(function (data, type, full) {
            var html = full.description;
            return html;

        }),
        DTColumnBuilder.newColumn(null).withClass("none").renderWith(function (data, type, full) {
            var html = "<table>";
            angular.forEach(full.assignmentDocuments, function (item) {
                html = html + " <tr><td><i class='fas fa-download'>  Click <a href='" + item.assignmentFilePath +"'>here</a> to download.</i></td></tr>";
            });
            html = html + "</table>";
            return html;
        }),

         DTColumnBuilder.newColumn("resourceLink", "Resource").withClass("none").withOption('name', 'Resources').renderWith(function (data, type, full) {
                            var html = "<table>";
                            if(full.resourceLink!=null){
                              angular.forEach(full.resourceLink.split("\n"), function (item) {
                            html = html + " <tr><td><i class='fas fa-eye'>  Click <a href='" + item + "'>here</a> to View.</i></td></tr>";
                        });
                            }

                            html = html + "</table>";
                            return html;

                        }),
                        DTColumnBuilder.newColumn(null).withClass("none").withOption(null).renderWith(function (data, type, full) {
                        var html='';
                                                    html=html+ '<td><button class="btn btn-success  btn-sm" onclick="angular.element(this).scope().saveAssignmentWork(' + data.assignmentId+',' + data.assignmentTypeId+')">' + 'Upload  Work' +'</button>';
                                                    html=html+'<button class="btn btn-success  btn-sm" onclick="angular.element(this).scope().saveAssignmentWorkFlow(' + data.assignmentId+',' + data.assignmentTypeId+')">' + 'Ask Question'+'</button></td>';
                                                    return html;

                                                }),

    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getAssignment = function () {
        $scope.orderInstance.rerender();
    };

     $scope.saveAssignmentWork = function (assignmentId,assignmentTypeId) {
            $state.go('app.student.saveAssignmentWork', { assignmentId: assignmentId,assignmentTypeId:assignmentTypeId});
        }

         $scope.saveAssignmentWorkFlow = function (assignmentId,assignmentTypeId) {
                    $state.go('app.student.saveAssignmentWorkFlow', { assignmentId: assignmentId,assignmentTypeId:assignmentTypeId});
                }
});

