colorAdminApp.controller('adminViewAssignmentController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    var startDate = new Date();
     startDate.setDate(new Date().getDate() - 3);
    $scope.search = {startDate:$scope.formatDate(startDate), endDate: $scope.formatDate(new Date()), group: { groupId: 0 },section: { sectionId: 0 }, student: { studentId: 0 } };
    $scope.screenId = 260;
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;

    $http.post($scope.webApiUrl + 'admin/GetClassList', JSON.stringify({
        apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId,screenId:$scope.screenId, adminId: $scope.user.entityId

    })).success(function (result) {
        if (result.status == true) {
            $scope.userGroups = result.data;
            $scope.userGroups.unshift({ groupId: 0, groupName: "Select Class" });
        }
        else {
            $scope.error(result.message, true);
        }
    }).error(function (error, status) {
        $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
    });

 $scope.getSections = function () {
           if($scope.school.isSectionApplicable){
             $http.post($scope.webApiUrl + 'shared/GetSectionList', JSON.stringify({
                    apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, screenId: $scope.screenId, groupId: $scope.search.group.groupId

                })).success(function (result) {

                    if (result.status == true) {
                        $scope.userSections = result.data;
                        $scope.userSections.unshift({ sectionId: 0, sectionName: "Select Section" });
                    }
                    else {
                        $scope.error(result.message, true);
                    }
                }).error(function (error, status) {
                    $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
                });
           }
        }


    $scope.getStudents = function () {
        $http.post($scope.webApiUrl + 'shared/GetClassStudents', JSON.stringify({
            apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, classId: $scope.search.group.groupId, sectionId: $scope.search.section.sectionId

        })).success(function (result) {
            if (result.status == true) {
                $scope.students = result.data;
                $scope.students.unshift({ studentId: 0, fullName: "Select Name" });
            }
            else {
                $scope.error(result.message, true);
            }
        }).error(function (error, status) {
            $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
        });
    }

    function getAssignments(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.get($scope.webApiUrl + 'admin/GetAssignments?apiKey=' + $scope.school.appKey + '&adminId=' + $scope.user.entityId + "&academicYearId=" + $scope.academicYear.academicYearId +
            '&startDate=' + $scope.search.startDate + '&endDate=' + $scope.search.endDate  +'&classId=' + $scope.search.group.groupId + '&sectionId=' + $scope.search.section.sectionId + '&isSectionApplicable=' + $scope.school.isSectionApplicable+  '&studentId=' + $scope.search.student.studentId).success(function (result) {
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
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getAssignments)
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
        DTColumnBuilder.newColumn("assignmentTypeName", "Type").withOption('name', 'Assignment Type').withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
            var html = full.assignmentTypeName;
            return html;

        }),
        DTColumnBuilder.newColumn("assignmentTypeName", "Class/Student").withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
            var html = full.assignmentTypeId == 1 ? full.className+' '+full.sectionName : full.fullName;
            return html;

        }),
        DTColumnBuilder.newColumn("assignmentDate", "Date").withClass("none").withOption('name', 'Date').renderWith(function (data, type, full) {
            return $filter('date')(full.assignmentDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');
            return html;
        }),

         DTColumnBuilder.newColumn("createdDate", "Created Date").withClass("none").withOption('name', 'Created Date').renderWith(function (data, type, full) {
                            return $filter('date')(full.createdDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy hh:mm a');
                            return html;
                        }),
        DTColumnBuilder.newColumn("subjectName", "Subject").withOption('name', 'Subject').withClass("none").renderWith(function (data, type, full) {
            var html = full.subjectName;
            return html;

        }),
        DTColumnBuilder.newColumn("deadline", "Deadline").withClass("none").withOption('name', 'Deadline').renderWith(function (data, type, full) {
            return $filter('date')(full.deadline.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');
            return html;
        }),
        DTColumnBuilder.newColumn("description", "Description").withOption('name', 'Description').withClass("none").renderWith(function (data, type, full) {
            var html = full.description;
            return html;

        }),

        DTColumnBuilder.newColumn(null).withClass("none").withOption('name', 'Download Assignment').renderWith(function (data, type, full) {
            var html = "<table>";
            angular.forEach(full.assignmentDocuments, function (item) {
                html = html + " <tr><td><i class='fas fa-download'>  Click <a href='" + item.assignmentFilePath + "'>here</a> to download.</i></td></tr>";
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
         DTColumnBuilder.newColumn(null).withClass("f-s-600 text-inverse").withTitle('').notSortable()
                       .renderWith(function (data, type, full, meta) {
                            return '<button class="btn btn-success btn-icon btn-circle btn-sm">' + ' <i class="fa fa-eye"></i>'+ (data.totalAssignmentWork>0 ?'<span class="label-upper">'+ data.totalAssignmentWork+'</span>' : '') +'</button>';

                       }),
        DTColumnBuilder.newColumn(null).withClass("f-s-600 text-inverse").withTitle('').notSortable()
                     .renderWith(function (data, type, full, meta) {
                      return '<button class="btn btn-success btn-icon btn-circle btn-sm">' + ' <i class="fa fa-comments"></i>'+ (data.totalQuestionAnswer>0 ?'<span class="label-upper">'+ data.totalQuestionAnswer+'</span>' : '') +'</button>';

                     }),
        DTColumnBuilder.newColumn(null).withTitle().withClass("f-s-600 text-inverse").notSortable()
            .renderWith(function (data, type, full, meta) {
                return '<button class="btn btn-danger btn-icon btn-circle btn-sm" ng-click="deleteAssignment(' + data.assignmentId + ',' + data.assignmentTypeId + ')">' + ' <i class="fa fa-times"></i></button>';
            }),
            DTColumnBuilder.newColumn(null).withClass("none").withOption(null).renderWith(function (data, type, full) {
                                    var html='';
                                                                html=html+ '<td><button class="btn btn-success btn-sm"  onclick="angular.element(this).scope().viewAssignmentWork(' + data.assignmentId+',' + data.assignmentTypeId+')">' + 'View Assignment Work' +'</button><br/>';
                                                                html=html+'<button class="btn btn-success btn-sm" onclick="angular.element(this).scope().viewAssignmentWorkFlow(' + data.assignmentId+',' + data.assignmentTypeId+')">' + 'View Assignment Question' +'</button></td>';
                                                                return html;

                                                            }),
    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getAssignments = function () {
        $scope.orderInstance.rerender();
    };

    function onConfirmDelete(buttonIndex, asmId, asmTypeId) {
     
        if(buttonIndex==1)
        {
            $http.post($scope.webApiUrl + 'admin/DeleteAssignment', JSON.stringify({
                apiKey: $scope.school.appKey, entityId: $scope.user.entityId,
                assignmentId: asmId, assignmentTypeId: asmTypeId, academicYearId: $scope.academicYear.academicYearId

            })).success(function (result) {
                if (result.status == true) {
                    $scope.success("Assignment has been deleted successfully", true);
                    $scope.orderInstance.rerender();
                }
                else {
                    $scope.error(result.message, true);
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
            });
        }
    }

    var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

    $scope.deleteAssignment = function (asmId, asmTypeId) {
      
        if (app) {
            navigator.notification.confirm(
                'Are you sure to delete this assignment!',
                function (buttonIndex) {
                    onConfirmDelete(buttonIndex, asmId, asmTypeId);
                },
                'Please confirm',
                ['OK', 'CANCEL']
            );
        }
        else {
            var conf = confirm(' Are you sure to delete this assignment?') ? 1 : 0;
            onConfirmDelete(conf, asmId, asmTypeId);
        }
    }

     $scope.viewAssignmentWork = function (assignmentId,assignmentTypeId) {
                            $state.go('app.admin.assignment.viewAssignmentWork', { assignmentId: assignmentId,assignmentTypeId:assignmentTypeId});
                        }
      $scope.viewAssignmentWorkFlow = function (assignmentId,assignmentTypeId) {
                            $state.go('app.admin.assignment.viewAssignmentWorkFlow', { assignmentId: assignmentId,assignmentTypeId:assignmentTypeId});
                        }
});

