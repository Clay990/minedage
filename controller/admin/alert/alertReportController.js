colorAdminApp.controller('adminAlertReportController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.userscreen = JSON.parse(window.localStorage.getItem("userscreen"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.isSendAppAlert = $scope.userscreen.filter(function (item) { return item.screenId == 189; }).length > 0;
    $scope.startDate = $scope.formatDate(new Date());
    $scope.endDate = $scope.formatDate(new Date());
    $scope.screenId = 131;
    $scope.alertCategories;
    $scope.alertCategory = { selectedCategory: { alertCategoryId: 0 } };
    $scope.search = { group: { groupId: 0 },role: { roleId: 0 },section:{sectionId:0},class:{classId:0} };
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;

$http.post($scope.webApiUrl + 'admin/GetRoleAlert', JSON.stringify({
           apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId,screenId:$scope.screenId, adminId: $scope.user.entityId

       })).success(function (result) {
           if (result.status == true) {
               $scope.roleAlert = result.data;
               $scope.roleAlert.unshift({ roleId: 0, roleName: "User Type" });
           }
           else {
               $scope.error(result.message, true);
           }
       }).error(function (error, status) {
           $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
           });


$scope.OnRoleChange = function () {

       $http.post($scope.webApiUrl + 'admin/GetUserGroupList', JSON.stringify({
                   apiKey: $scope.school.appKey,roleId:$scope.search.role.roleId,classId:0,sectionId:0,groupId:$scope.search.group.groupId, academicYearId: $scope.academicYear.academicYearId,screenId:$scope.screenId, adminId: $scope.user.entityId

               })).success(function (result) {

                   if (result.status == true) {

                       $scope.userGroups = result.data
                       $scope.userGroups.unshift({ groupId: 0, groupName: "Select Group" });
                   }
                   else {
                       $scope.error(result.message, true);
                   }
               }).error(function (error, status) {
                   $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
               });
         };



        $scope.getSections = function () {
                   if($scope.school.isSectionApplicable && $scope.search.role.roleId===5){
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


    $http.get($scope.webApiUrl + 'shared/GetNoticeAlertCategories?apiKey=' + $scope.school.appKey + "&academicYearId=" + $scope.academicYear.academicYearId
            ).success(function (result) {
                 if (result.status == true) {
                     $scope.alertCategories = result.data;
                     $scope.alertCategories.unshift({ alertCategoryId: 0, alertCategoryName: 'Select Category' })
                 }
                 else {
                     $scope.error(result.message, true);
                 }
             }).error(function (error, status) {
                 $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
             });

    function getAlertReport(sSource, aoData, fnCallback, oSettings) {
      
        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.get($scope.webApiUrl + 'admin/GetAlertReport?apiKey=' + $scope.school.appKey + '&adminId=' + $scope.user.entityId + '&roleId=' + $scope.search.role.roleId +'&groupId=' + $scope.search.group.groupId +'&classId=' +0+ "&academicYearId=" + $scope.academicYear.academicYearId +
            '&startDate=' + $scope.startDate + '&endDate=' + $scope.endDate + '&alertCategoryId=' + $scope.alertCategory.selectedCategory.alertCategoryId).success(function (result) {
                if (result.status == true) {
                debugger;
                    $scope.alertReport = result.data;
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

    $scope.alertInstance = {};
    $scope.alertOptions = DTOptionsBuilder.newOptions().withFnServerData(getAlertReport)
    .withOption('processing', false)
    .withOption('oLanguage', {
        "sZeroRecords": "No Alert Found.",
    }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
    .withOption('serverSide', true)
    .withPaginationType('full_numbers')
    .withOption('createdRow', createdRow)
         .withOption('autoWidth', false)
    .withBootstrap()

    $scope.alertColumns = [

          DTColumnBuilder.newColumn("alertMessage", "Message").withOption('name', 'Message').withClass("none").renderWith(function (data, type, full) {
              var html = "<div style='white-space:normal;width:200px;'>" + full.alertMessage + "</div>";

              return html;

        }),
        DTColumnBuilder.newColumn("fullName", "Name").withClass("none").withOption('name', 'Name').renderWith(function (data, type, full) {
            var html = full.fullName;
            return html;
        }),

            DTColumnBuilder.newColumn("alertCategoryName", "Category").withClass("none").withOption('name', 'Category').renderWith(function (data, type, full) {
                var html = full.alertCategoryName;
                return html;
            }),

             DTColumnBuilder.newColumn("groupName", "Group/Class").withOption('name', 'Group').withClass("none").renderWith(function (data, type, full) {
                            var html = full.groupName+'  '+(full.sectionName==null?'':full.sectionName);
                            return html;
                        }),

            DTColumnBuilder.newColumn("alertDate", "Date").withClass("none").withOption('name', 'Date').renderWith(function (data, type, full) {
                return full.alertDate;
            }),
            DTColumnBuilder.newColumn("alertTime", "Time").withClass("none").withOption('name', 'Time').renderWith(function (data, type, full) {
                return full.alertTime;
            }),

    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getAlertReport = function () {
        $scope.alertInstance.rerender();
    };

});

