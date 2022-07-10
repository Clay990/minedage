colorAdminApp.controller('studentElearningController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
   
   $scope.subject = { subjectId: 0 };
   $scope.chapter= { chapterId: 0 }
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
                     $scope.subjects.unshift({ subjectId: 0, subjectName: "Select Subject" });
                }
                else {
                    $scope.error(result.message, true);
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
            });
$scope.getChapters = function (){
    $http.post($scope.webApiUrl + 'shared/GetClassSubjectChapter', JSON.stringify({
                apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, classId:$scope.user.classId,
                sectionId:$scope.user.sectionId,subjectId:$scope.subject.subjectId
            })).success(function (result) {
                if (result.status == true) {
                    $scope.chapters = result.data;
                     $scope.chapters.unshift({ chapterId: 0, chapterName: "Select Chapter" });
                }
                else {
                    $scope.error(result.message, true);
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
            });
}
    function getElearningMaterial(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.get($scope.webApiUrl + 'student/GetElearningMaterials?apiKey=' + $scope.school.appKey + '&studentId=' + $scope.user.entityId + '&sectionId=' + $scope.user.sectionId +'&classId=' + $scope.user.classId + '&subjectId=' + $scope.subject.subjectId +'&chapterId=' + $scope.chapter.chapterId  +'&isSectionApplicable=' + $scope.school.isSectionApplicable + "&academicYearId=" + $scope.academicYear.academicYearId +
            '&startDate=' + $scope.startDate + '&endDate=' + $scope.endDate).success(function (result) {
                if (result.status == true) {
                    $scope.learningMaterials = result.data;
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
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getElearningMaterial)
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

      
        DTColumnBuilder.newColumn("subjectName", "Subject").withClass("f-s-600 text-inverse").withOption('name', 'Subject').renderWith(function (data, type, full) {
            var html = full.subjectName;
            return html;

        }),
      DTColumnBuilder.newColumn("startDate", "Start Date").withClass("f-s-600 text-inverse").withOption('name', 'Start Date').renderWith(function (data, type, full) {
            return $filter('date')(full.startDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');

        }),
         DTColumnBuilder.newColumn("endDate", "End Date").withClass("f-s-600 text-inverse").withOption('name', 'End Date').renderWith(function (data, type, full) {
            return $filter('date')(full.endDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');

        }),
       DTColumnBuilder.newColumn("chapterName", "Chapter").withOption('name', 'Chapter').withClass("none").renderWith(function (data, type, full) {
            var html = full.chapterName;
            return html;

        }),
        DTColumnBuilder.newColumn("description", "Description").withOption('name', 'Description').withClass("none").renderWith(function (data, type, full) {
            var html = full.description;
            return html;

        }),
        DTColumnBuilder.newColumn(null).withClass("none").renderWith(function (data, type, full) {
            var html = "<table>";
            debugger;
             if(full.elearningDocuments!=null)
            angular.forEach(full.elearningDocuments, function (item) {
                html = html + " <tr><td><i class='fas fa-download'>  Click <a href='" + item.docFilePath +"'>here</a> to download.</i></td></tr>";
            });
            else
            html = html + " <tr><td>Document Not Uploaded</td></tr>";
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
                       

    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getElearningMaterial = function () {
        $scope.orderInstance.rerender();
    };

   
});

