colorAdminApp.controller('changePasswordController', function ($scope, $rootScope, $state, $http) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.userName = window.localStorage.getItem("userName");
    $scope.password = window.localStorage.getItem("password");
    $scope.user;

      $scope.showPassword = false;

      $scope.toggleShowPassword = function() {
        $scope.showPassword = !$scope.showPassword;
      }

    $scope.changePassword = function (form) {
         if ($scope.changePasswordForm.$invalid) {
                    angular.forEach($scope.changePasswordForm.$error, function (field) {
                        angular.forEach(field, function (errorField) {
                            errorField.$setTouched();
                        });
                    });
                    angular.element("[name='" + $scope.changePasswordForm.$name + "']").find('.ng-invalid:visible:first').focus();
                }

                if ($scope.changePasswordForm.$valid) {

            if ($scope.user.oldPassword != $scope.user.password)
            {
                $scope.error("Wrong old password.", true);
                return;
            }
            if ($scope.user.newPassword != $scope.user.confirmNewPassword) {
                $scope.error("New password and confirm password do not match.", true);
                return;
            }
            $http.get($scope.webApiUrl + 'shared/ChangePassword?apiKey=' + $scope.school.appKey + '&academicYearId=' + $scope.academicYear.academicYearId + '&entityId=' + $scope.user.entityId + '&roleId=' + $scope.user.roleId
                     + '&password=' + $scope.user.newPassword).success(function (result) {
                         if (result == null) {
                             $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);

                }
                else {
                    if (result.status == true) {
                        $scope.success(result.message, true);
                        $state.go('member.login');
                       
                    }
                    else {
                        $scope.error(result.message, true);
                    }
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
            });
        }

    };
  

});
