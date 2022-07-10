colorAdminApp.controller('adminStudentListController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.search = { group: { groupId: 0 },class: { groupId: 0 },section:{sectionId:0} };
    $scope.screenId = 131;
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;

        $http.post($scope.webApiUrl + 'admin/GetUserGroupList', JSON.stringify({
                           apiKey: $scope.school.appKey,roleId:5,groupId:0,classId:0,sectionId:0, academicYearId: $scope.academicYear.academicYearId,screenId:$scope.screenId, adminId: $scope.user.entityId

                       })).success(function (result) {

                           if (result.status == true) {

                               $scope.userGroups = result.data
                               $scope.userGroups.unshift({ groupId: 0, groupName: "Select Group" });
                               if(result.data.length===0){
                                    $scope.search.group.groupId=0;
                               }
                           }
                           else {
                               $scope.error(result.message, true);
                           }
                       }).error(function (error, status) {
                           $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
                       });


    $http.post($scope.webApiUrl + 'admin/GetClassList', JSON.stringify({
        apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId,screenId:$scope.screenId, adminId: $scope.user.entityId

    })).success(function (result) {

        if (result.status == true) {
            $scope.userClasses = result.data;
            $scope.userClasses.unshift({ groupId: 0, groupName: "Select Class" });
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
                    apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId, screenId: $scope.screenId, groupId: $scope.search.class.groupId

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

    function getStudentList(sSource, aoData, fnCallback, oSettings) {

            var draw = aoData[0].value;
        $scope.draw = draw;
        if ($scope.search.class.groupId != 0 || $scope.search.group.groupId !=0) {
            $http.post($scope.webApiUrl + 'admin/GetStudentList', JSON.stringify({
                apiKey: $scope.school.appKey, adminId: $scope.user.entityId,
                studentName: $scope.studentName, groupId: $scope.search.group.groupId,classId: $scope.search.class.groupId,sectionId: $scope.search.section.sectionId, academicYearId: $scope.academicYear.academicYearId

            })).success(function (result) {
               
                if (result.status == true) {
                    $scope.studentList = result.data;
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
    }

        $scope.orderInstance = {};
        $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getStudentList)
            .withOption('processing', false)
            .withOption('oLanguage', {
                "sZeroRecords": "No Student Found.",
            }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
            .withOption('serverSide', true)
            .withPaginationType('full_numbers')
            .withOption('createdRow', createdRow)
            .withOption('autoWidth', false)
            .withBootstrap()

        $scope.orderColumns = [

           DTColumnBuilder.newColumn(null).withTitle('Name').notSortable()
                           .renderWith(function (data, type, full, meta) {
                               return '<button class="btn btn-success" ng-click="viewDetail(' + data.studentId + ')">'  + full.fullName + '</button>';
                           }),

            DTColumnBuilder.newColumn("className", "Class").withClass("f-s-600 text-inverse").withOption('name', 'Class').renderWith(function (data, type, full) {
                var html = full.className +' '+full.sectionName;
                return html;
            }),

        ];

        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }
    $scope.getStudentList = function () {

        if ($scope.search.class.groupId != 0 || $scope.search.group.groupId != 0) {
            $scope.orderInstance.rerender();
        }
        else{
            $scope.error("Please Select Class/Group", true);
        }
        };

    $scope.viewDetail = function (id) {
        $state.go('app.admin.attendance.viewStudentDetail', { studentId: id });
    }


});

