colorAdminApp.controller('adminViewAssignmentWorkFlowController', function ($scope, $rootScope, $http, $state,$stateParams, DTOptionsBuilder, DTColumnBuilder, $filter, $compile, $q) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.screenId = 260;
    Dropzone.autoDiscover = false;
    $scope.assignmentWorkFlowId=0;
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

    if (app) {
        var permissions = cordova.plugins.permissions;

        permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);
        permissions.hasPermission(permissions.CAMERA, checkCameraPermissionCallback, null);


    }

function checkCameraPermissionCallback(status) {
        if (!status.hasPermission) {
            var errorCallback = function () {
                console.warn('Camera permission is not turned on');
            }
            permissions.requestPermission(
              permissions.CAMERA,
              function (status) {
                  if (!status.hasPermission) {
                      errorCallback();
                  } else {
                      // continue with downloading/ Accessing operation
                  }
              },
              errorCallback);
        }
    }
    function checkPermissionCallback(status) {
        if (!status.hasPermission) {
            var errorCallback = function () {
                console.warn('Storage permission is not turned on');
            }
            permissions.requestPermission(
              permissions.READ_EXTERNAL_STORAGE,
              function (status) {
                  if (!status.hasPermission) {
                      errorCallback();
                  } else {
                      // continue with downloading/ Accessing operation
                  }
              },
              errorCallback);
        }
    }


         function getSavedAssignmentFlows(sSource, aoData, fnCallback, oSettings) {
          var draw = aoData[0].value;
                 $scope.draw = draw;
                $http.get($scope.webApiUrl + 'shared/GetSavedAssignmentWorkFlow?apiKey=' + $scope.school.appKey + '&entityId=' + $scope.user.entityId +'&roleId=' + $scope.user.roleId + "&academicYearId=" + $scope.academicYear.academicYearId +
                "&assignmentId="+ $stateParams.assignmentId+"&assignmentTypeId="+ $stateParams.assignmentTypeId ).success(function (result) {
                        if (result.status == true) {

                            $scope.assignmentWorkFlow = result.data;
                            var records = {
                                'draw': draw,
                                'recordsTotal': result.recordsTotal,
                                'recordsFiltered': result.recordsFiltered,
                                'data': result.data.filter(function (item) {
                                 return item.roleId === 5;
                             })
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

          function getTeacherAssignmentFlows(sSource, aoData, fnCallback, oSettings) {
                 var draw = aoData[0].value;
                 $scope.draw = draw;
                 $http.get($scope.webApiUrl + 'shared/GetSavedAssignmentWorkFlow?apiKey=' + $scope.school.appKey + '&entityId=' + $scope.user.entityId + '&roleId=' + $scope.user.roleId + "&academicYearId=" + $scope.academicYear.academicYearId +
                     "&assignmentId=" + $stateParams.assignmentId+"&assignmentTypeId="+ $stateParams.assignmentTypeId).success(function (result) {
                         if (result.status == true) {

                             $scope.assignmentWorkFlow = result.data;
                             var records = {
                                 'draw': draw,
                                 'recordsTotal': result.recordsTotal,
                                 'recordsFiltered': result.recordsFiltered,
                                 'data': result.data.filter(function (item) {
                                     return item.roleId === 2;
                                 })
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
                     $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getSavedAssignmentFlows)
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


                         DTColumnBuilder.newColumn("fullName", "Name").withClass("f-s-600 text-inverse").withOption('name', 'Name').renderWith(function (data, type, full) {
                                 var html = full.fullName;
                                 return html;

                             }),
                             DTColumnBuilder.newColumn("description", "Description").withClass("f-s-600 text-inverse").withOption('name', 'Description').renderWith(function (data, type, full) {
                                 var html = full.description;
                                 return html;

                             }),
                         DTColumnBuilder.newColumn("createdDate", "Created Date").withClass("none").withOption('name', 'Created Date').renderWith(function (data, type, full) {
                                    return $filter('date')(full.createdDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy hh:mm a');
                                    return html;
                                }),
                         DTColumnBuilder.newColumn(null).withClass("none").withOption('name', 'Download File').renderWith(function (data, type, full) {
                             var html = "<table>";

                             angular.forEach(full.assignmentWorkFlowFilePath, function (item) {
                                 html = html + " <tr><td><i class='fas fa-download'>  Click <a href='" + item + "'>here</a> to download.</i></td></tr>";
                             });
                             html = html + "</table>";
                             return html;
                         })

                     ];

                      function createdRow(row, data, dataIndex) {
                             $compile(angular.element(row).contents())($scope);
                         }

$scope.teacherInstance = {};
    $scope.teacherOptions = DTOptionsBuilder.newOptions().withFnServerData(getTeacherAssignmentFlows)
        .withOption('processing', false)
        .withOption('oLanguage', {
            "sZeroRecords": "No Record Found.",
        }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers')
        .withOption('createdRow', teacherCreatedRow)
        .withOption('autoWidth', false)
        .withBootstrap()

    $scope.teacherColumns = [


        DTColumnBuilder.newColumn("description", "Description").withClass("f-s-600 text-inverse").withOption('name', 'Description').withClass("none").renderWith(function (data, type, full) {
            var html = full.description;
            return html;

        }),
        DTColumnBuilder.newColumn("fullName", "Created By").withClass("f-s-600 text-inverse").withOption('name', 'Created By').withClass("none").renderWith(function (data, type, full) {
            var html = full.fullName;
            return html;

        }),

        DTColumnBuilder.newColumn("createdDate", "Created Date").withClass("none").withOption('name', 'Created Date').renderWith(function (data, type, full) {
            return $filter('date')(full.createdDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy hh:mm a');
            return html;
        }),

        DTColumnBuilder.newColumn(null).withClass("none").withOption('name', 'Download File').renderWith(function (data, type, full) {
            var html = "<table>";

            angular.forEach(full.assignmentWorkFlowFilePath, function (item) {
                html = html + " <tr><td><i class='fas fa-download'>  Click <a href='" + item + "'>here</a> to download.</i></td></tr>";
            });
            html = html + "</table>";
            return html;
        })

    ];

    function teacherCreatedRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
     $scope.getSavedAssignmentFlows = function () {
            $scope.orderInstance.rerender();
        };

});

