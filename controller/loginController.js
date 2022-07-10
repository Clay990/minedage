colorAdminApp.controller('loginController', function ($scope, $rootScope, $state, $http, $q, $stateParams) {
    $rootScope.setting.layout.pageWithoutHeader = true;
    $rootScope.setting.layout.paceTop = true;
$scope.applicationId = "";
    $scope.userName = window.localStorage.getItem("userName");
    $scope.password = window.localStorage.getItem("password");
    $scope.rememberMe = window.localStorage.getItem("rememberMe") == "true" || window.localStorage.getItem("rememberMe")==null? true : false;
     $scope.mobileNo=window.localStorage.getItem("phoneNumber");
     $scope.isSimNumber=window.localStorage.getItem("isSimNumber");
    $scope.isForgetCredential = false;
    $scope.isHelp = false;

    $scope.showPassword = false;

      $scope.toggleShowPassword = function() {
        $scope.showPassword = !$scope.showPassword;
      }
$scope.resetUser = function()
{
   window.localStorage.removeItem("branchApiUrl");
        window.localStorage.removeItem("selectedSearch");
        window.localStorage.removeItem("userName");
        window.localStorage.removeItem("password");
        
        window.localStorage.removeItem("isSimNumber");
         $rootScope.$broadcast("branchChanged", $scope.branchApiUrl);
         $state.go("member.branch");
}
    $scope.help = [];

                $scope.getLoginInfo = function () {
                                   $http.get($scope.webApiUrl + 'shared/GetLoginInfo?mobileNo=' + $scope.mobileNo).success(function (result)
                                   {

                                                   if (result == null) {
                                                       $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
                                                   }
                                                   else {

                                                       if (result.status == true) {
                                                           //$scope.success(result.message);
                                                           $scope.userName = result.data.loginId;
                                                           $scope.password = result.data.password;
                                                           $scope.doUserLogin();
                                                       }
                                                       else {
                                                           $scope.error(result.message, false);
                                                       }
                                                   }
                                               }).error(function (error, status) {
                                                   $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", false);
                                               });
                                   }
function goToPlayStore(buttonIndex) {

  if($scope.applicationTypeId==2)
  {
window.open("https://play.google.com/store/apps/details?id="+$scope.applicationId);
  }
  else if($scope.applicationTypeId==3)
  {
window.open("https://apps.apple.com/us/app/"+$scope.applicationId);
  }
else
{
  window.open("http://stackoverflow.com");
}

    }
$scope.doUserLogin = function () {
if ($scope.rememberMe == true) {
                window.localStorage.setItem("userName", $scope.userName);
                window.localStorage.setItem("password", $scope.password);
            }
            else {
                window.localStorage.removeItem("userName");
                window.localStorage.removeItem("password");
            }
            window.localStorage.setItem("rememberMe", $scope.rememberMe);
            $http.post($scope.webApiUrl + 'shared/Login',
            JSON.stringify({loginId: $scope.userName,
                      password :$scope.password,
                      applicationTypeId: $scope.applicationTypeId,
                      version: $scope.version
                      })).success(function (result) {
debugger;
                if (result == null) {

                    $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", false);

                }
                else {
                    if (result.status == true) {

                        window.localStorage.setItem("user", JSON.stringify(result.data));
                        window.localStorage.setItem("academicYear", JSON.stringify(result.data1));
                        window.localStorage.setItem("school", JSON.stringify(result.data2));
                        window.localStorage.setItem("generalSetting", JSON.stringify(result.data3));
                        
                        window.localStorage.setItem("userscreen", JSON.stringify(result.userScreen));
                          $scope.registerDevice();
                         


                          if($stateParams.redirectUrl==null)
                          {

                        $state.go('app.'+result.data.roleName.toLowerCase()+'.screen');
                        }
                        else
                        {
                        $state.go($stateParams.redirectUrl);
                        }
                    }
                    else {
                    if(result.data!=null)
                    {
var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
        $scope.applicationId = result.data;
            if (app) {
                navigator.notification.confirm(
                    result.message,
                    goToPlayStore,
                    'Please confirm',
                    ['OK', 'CANCEL']
                );
            }
            else {
                var conf = (confirm(result.message)) ? 1 : 0;
                goToPlayStore(conf);
            }
      }
      else
      {
      $scope.error(result.message, false);
      }
                    }
}
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", false);
            });
}

    $scope.loginUser = function () {

        if ($scope.loginForm.$invalid) {
            angular.forEach($scope.loginForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
            angular.element("[name='" + $scope.loginForm.$name + "']").find('.ng-invalid:visible:first').focus();
        }
        if ($scope.loginForm.$valid) {

$scope.doUserLogin();
        }
    };
    $scope.forgetCredential = function (form) {
        if ($scope.loginForm.$invalid) {
            angular.forEach($scope.loginForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
            angular.element("[name='" + $scope.loginForm.$name + "']").find('.ng-invalid:visible:first').focus();
        }

        if ($scope.loginForm.$valid) {
            $http.get($scope.webApiUrl + 'shared/GetLoginCredential?mobileNo=' + $scope.mobileNo + "&roleId=5").success(function (result) {
                if (result == null) {
                    $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", false);
                }
                else {
                    if (result.status == true) {
                        $scope.success(result.message, false);
                    }
                    else {
                        $scope.error(result.message, false);
                    }
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", false);
            });
        }
    };

    $scope.createHelp = function (form) {
        if ($scope.helpForm.$invalid) {
            angular.forEach($scope.helpForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
            angular.element("[name='" + $scope.helpForm.$name + "']").find('.ng-invalid:visible:first').focus();
        }
        if ($scope.helpForm.$valid) {
            var helpData = {
                name: $scope.help.name,
                message: $scope.help.message,
                mobileNo: $scope.help.mobileNo,

            };


            helpData = JSON.stringify(helpData);
            $http.post($scope.webApiUrl + 'shared/CreateAnonymousHelp', helpData).success(function (result) {
                if (result == null) {
                    $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", false);
                }
                else {
                    if (result.status == true) {
                        $scope.success(result.message, false);
                        $scope.help = null;
                    }
                    else {
                        $scope.error(result.message, false);
                    }

                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", false);
            });
        }
    };

if($scope.isSimNumber!=null)
            {
            $scope.getLoginInfo();
            }
            else if($scope.userName!=null)
            {
            $scope.doUserLogin();
            }
});
