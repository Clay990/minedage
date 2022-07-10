colorAdminApp.controller('phoneNumberController', function ($scope, $rootScope, $state, $http, $q, $stateParams,$timeout) {
    $rootScope.setting.layout.pageWithoutHeader = true;
    $rootScope.setting.layout.paceTop = true;
     $scope.phone={};
        $scope.phone.mobileNo=window.localStorage.getItem("phoneNumber")==null || window.localStorage.getItem("phoneNumber")=="undefined" ?"": window.localStorage.getItem("phoneNumber");
        $scope.phone.code="";
    $scope.isPhoneNumber = false;
    $scope.isSendLoginOTP = false;



$scope.isSimNumber=window.localStorage.getItem("isSimNumber");
if($scope.phone.mobileNo!="")
{
$state.go("member.login");
}
//
function simReadSuccessCallback(result) {
////alert("success");
window.plugins.sim.getSimInfo(readSimInformation, errorReadSimInformation);
//
//
//
}
//
function simReadErrorCallback(error) {
////alert(error);
}
function errorReadSimInformation(error) {
////alert(error);
}

function readSimInformation(result) {
////alert(result.phoneNumber);
                                if(result.phoneNumber.length==10)
                              {
                              window.localStorage.setItem("phoneNumber", result.phoneNumber);
                             window.localStorage.setItem("isSimNumber", "true");
                             $state.go("member.login");
                              }
}
 var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

 if(window.localStorage.getItem("phoneNumber")==null || window.localStorage.getItem("phoneNumber")=="undefined")
 {
       if (app) {

//              $timeout(function() {
//                             window.plugins.sim.requestReadPermission(simReadSuccessCallback, simReadErrorCallback);
//                           }, 5000);
//                }

     }
     else
     {
     //$state.go("member.login");
     }
}

    $scope.submitPhoneNumber = function () {

        if ($scope.phoneNumberForm.$invalid) {
            angular.forEach($scope.phoneNumberForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
            angular.element("[name='" + $scope.phoneNumberForm.$name + "']").find('.ng-invalid:visible:first').focus();
        }
        if ($scope.phoneNumberForm.$valid) {
        if($scope.phone.mobileNo.length!=10)
        {
        $scope.error("Please enter valid mobile number.", false)
        return;
        }

        $http.get($scope.webApiUrl + 'shared/SendLoginOtp?mobileNo=' + $scope.phone.mobileNo).success(function (result)
         {
$scope.isPhoneNumber = true;
                         if (result == null) {
                             $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", false);
                         }
                         else {

                             if (result.status == true) {
                                 $scope.success(result.message, false);
                                 $scope.isSendLoginOTP = true;
//                                 SMSReceive.startWatch(function() {
//                                }, function() {
//                                });
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

//    document.addEventListener('onSMSArrive', function(e) {
//     var sms = e.data;
////     debugger;
//if(sms.address.substr(-6)==$scope.senderId)
//{
//                var otp = (sms.body.match(/\d{6}/) || [false])[0];
//
//             $scope.phone.code=otp;
//          $scope.validateLoginOtp();
//
//        SMSReceive.stopWatch(function() {
//        }, function() {
//        });
//        }
//    });

 $scope.validateLoginOtp = function () {
if ($scope.phoneNumberForm.$invalid) {
            angular.forEach($scope.phoneNumberForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
    angular.element("[name='" + $scope.phoneNumberForm.$name + "']").find('.ng-invalid:visible:first').focus();
        }
        if ($scope.phoneNumberForm.$valid) {
       
        if($scope.phone.code.length!=6)
        {
        $scope.error("Please enter valid OTP.", false)
        return;
        }
        $http.get($scope.webApiUrl + 'shared/ValidateLoginOtp?mobileNo=' + $scope.phone.mobileNo+'&otp='+$scope.phone.code).success(function (result)
                 {

                                 if (result == null) {
                                     $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", false);
                                 }
                                 else {

                                     if (result.status == true) {
                                           window.localStorage.setItem("phoneNumber",$scope.phone.mobileNo);
                                           window.localStorage.setItem("isSimNumber", "true");
                                                 $state.go("member.login");

                                     }
                                     else {
                                         $scope.error(result.message, false);
                                     }
                                 }
                             }).error(function (error, status) {
                                 $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", false);
                             });
 }
}
 $scope.login = function (form) {


         if($scope.phone.mobileNo==null || $scope.phone.mobileNo.length!=10)
                 {
             $scope.error("Please enter valid mobile number.", false);
                 return;
                 }
         window.localStorage.setItem("phoneNumber",$scope.phone.mobileNo);
           $state.go("member.login");

 }

});
