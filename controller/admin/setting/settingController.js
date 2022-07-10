colorAdminApp.controller('teacherSettingController', function ($scope, $rootScope, $state, $http) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));


         $scope.getNotificationSetting = function () {
          $http.post($scope.webApiUrl + 'shared/GetNotificationSetting', JSON.stringify({
                        apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId,screenId:$scope.screenId, entityId: $scope.user.entityId,
                        roleId: $scope.user.roleId
                    })).success(function (result) {
                    debugger;
                        if (result.status == true) {

                           $scope.setting = result.data;
                        }
                        else {
                            $scope.error(result.message, true);
                        }
                      }).error(function (error, status) {
                        $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
                 });
          };

          $scope.setAppNotification = function (isAppNotification) {

              $scope.setting.isAppNotification = isAppNotification;
              $scope.saveNotificationSetting();
          }

          $scope.saveNotificationSetting = function () {
                    $http.post($scope.webApiUrl + 'shared/SaveNotificationSetting', JSON.stringify({
                                  apiKey: $scope.school.appKey, academicYearId: $scope.academicYear.academicYearId,screenId:$scope.screenId, entityId: $scope.user.entityId,
                                  roleId: $scope.user.roleId,
                                  languageId: $scope.setting.languageId, isAppNotification: $scope.setting.isAppNotification
                              })).success(function (result) {

                                  if (result.status == true) {

                                     $scope.setting = result.data;
                                  }
                                  else {
                                      $scope.error(result.message, true);
                                  }
                                }).error(function (error, status) {
                                  $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
                           });
                    };
    });
