colorAdminApp.controller('adminViewOnlineExamController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
     var startDate = new Date();
      //startDate.setDate(new Date().getDate() - 3);
    $scope.search = { startDate:$scope.formatDate(startDate), endDate: $scope.formatDate(new Date()), group: { groupId: 0 },section: { sectionId: 0 }, student: { studentId: 0 },subject: { subjectId: 0 }};
   var selectedSearch = JSON.parse(window.localStorage.getItem("selectedSearch"));

       if(selectedSearch!=null)
       {
         $scope.search = selectedSearch;
       }
    $scope.screenId = 1002;
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
 $scope.getSubjects();
        }

        $scope.getSubjects = function () {
            $http.post($scope.webApiUrl + 'shared/GetClassSubjects', JSON.stringify({
                apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, classId: $scope.search.group.groupId
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
        $scope.getSubjects();
    }


    function getOnlineExam(sSource, aoData, fnCallback, oSettings) {
        window.localStorage.setItem("selectedSearch", JSON.stringify($scope.search));
        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.get($scope.webApiUrl + 'admin/GetOnlineExams?apiKey=' + $scope.school.appKey + '&adminId=' + $scope.user.entityId +
         "&academicYearId=" + $scope.academicYear.academicYearId +
            '&startDate=' + $scope.search.startDate +
            '&endDate=' + $scope.search.endDate +
            '&classId=' + $scope.search.group.groupId +
            '&sectionId=' + $scope.search.section.sectionId +
             '&subjectId=' + $scope.search.subject.subjectId +
            '&isSectionApplicable=' + $scope.school.isSectionApplicable+
             '&studentId=' + $scope.search.student.studentId).success(function (result) {
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


        DTColumnBuilder.newColumn("onlineExamTypeName", "Class/Student").withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
            var html = full.onlineExamTypeId == 1 ? full.className+' '+full.sectionName : full.fullName;
            return html;

        }),
        DTColumnBuilder.newColumn("examDate", "Date").withClass("f-s-600 text-inverse").withOption('name', 'Date').renderWith(function (data, type, full) {
            return $filter('date')(full.examDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');
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
        DTColumnBuilder.newColumn("startTime", "Start Time").withClass("none").withOption('name', 'Start Time').renderWith(function (data, type, full) {
            return $filter('date')(full.startTime.replace('/Date(', '').replace(')/', ''), 'hh:mm a');
            return html;
        }),
         DTColumnBuilder.newColumn("endTime", "End Time").withClass("none").withOption('name', 'End Time').renderWith(function (data, type, full) {
                    return $filter('date')(full.endTime.replace('/Date(', '').replace(')/', ''), 'hh:mm a');
                    return html;
                }),
        DTColumnBuilder.newColumn("description", "Description").withOption('name', 'Description').withClass("none").renderWith(function (data, type, full) {
            var html = full.description;
            return html;

        }),

        DTColumnBuilder.newColumn("maxMarks", "Max Marks").withOption('name', 'Max Marks').withClass("none").renderWith(function (data, type, full) {
                    var html = full.maxMarks;
                    return html;

                }),

        DTColumnBuilder.newColumn(null).withClass("none").withOption('name', 'Download').renderWith(function (data, type, full) {
            var html = "<table>";
            angular.forEach(full.examDocuments, function (item) {
                html = html + " <tr><td><i class='fas fa-download'>  Click <a href='" + item.filePath + "'>here</a> to download Uploaded Questions.</i></td></tr>";
            });
            html = html + "</table>";
            return html;
        }),
         DTColumnBuilder.newColumn(null).withClass("f-s-600 text-inverse").withTitle('').notSortable()
                       .renderWith(function (data, type, full, meta) {
                            return '<button class="btn btn-success btn-icon btn-circle btn-sm" uib-tooltip="View Answer Sheet" ng-click="viewOnlineExamStudent(' + data.onlineExamId+',' + data.onlineExamTypeId+')">' + ' <i class="fa fa-eye"></i>)</button>';

                       }),
        DTColumnBuilder.newColumn(null).withClass("none").withOption('name', 'Exam Link').renderWith(function (data, type, full) {
                    var html = "<table>";
                    if(full.examLink!=null){
                    html = html + " <tr><td><i class='fas fa-eye'> Click <a href='" + full.examLink + "'>here</a> to View Exam Paper.</i></td></tr>";
                    }

                    html = html + "</table>";
                    return html;

                }),


    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getOnlineExam = function () {
        $scope.orderInstance.rerender();
    };

    $scope.viewOnlineExamStudent = function (onlineExamId,onlineExamTypeId) {
                        $state.go('app.admin.onlineExam.viewOnlineExamStudent', { onlineExamId: onlineExamId,onlineExamTypeId:onlineExamTypeId});
                    }

});

