colorAdminApp.controller('appController', function ($rootScope,$state, $scope, $http,$timeout) {

$scope.applicationTypeId = 2;
$scope.version = "1.2";
     $scope.backgroundImage = "images/background/back-2.jpg";
      //$scope.webApiUrl = "http://localhost:1767/api/";
       //$scope.webApiUrl = "https://stxaviersftp.rbstech.in/api/";
    // $scope.webApiUrl = "https://mgicgkp.edurbs1.in/api/";
     $scope.webApiUrl = "https://mindagecapuscare.mindage.in/api/";
     //$scope.webApiUrl = "http://ssps.toplogicinfotech.com/api/";
    // $scope.webApiUrl = "https://sunbeamacademysamneghat.edurbs1.in/api/";
      //$scope.webApiUrl = "https://renaissance.rbstech.in/api/";
     //$scope.webApiUrl = "https://daffodilslt.edurbs1.in/api/";
     //$scope.webApiUrl = "https://gspssrijan.edurbs1.in/api/";
    
      //$scope.webApiUrl = "http://ssmps.rbstech.in/api/";
       //$scope.webApiUrl = "https://mpsayodhya.rbstech.in/api/";
       //$scope.webApiUrl = "https://dmmv.rbstech.in/api/";
     //$scope.webApiUrl = "http://bsacademy.smartlogic.co.in/api/";
     // $scope.webApiUrl = "http://sainik.smartlogic.co.in/api/";
      //$scope.webApiUrl = "http://demo.coeprogram.co.in/api/";
     // $scope.webApiUrl = "http://demo.smartlogic.co.in/api/";
     //$scope.webApiUrl = "http://stxaviersftp.rbstech.in/api/";
     //$scope.webApiUrl = "http://192.168.0.106:1767/api/";
     //$scope.webApiUrl = "http://xavjnp.smartlogic.co.in/api/";
      //$scope.webApiUrl = "http://spsgkp.rbstech.in/api/";
     //$scope.webApiUrl = "http://demo.rblsolutions.com/api/";
     //$scope.webApiUrl = "http://sdpschool.smartlogic.co.in/api/";
     // $scope.webApiUrl = "https://mlzs.rbstech.in/api/";
      //$scope.webApiUrl = "http://demoerp1.rbstech.in/api/";
     //$scope.webApiUrl = "http://vanya.toplogicinfotech.com/api/";
      //$scope.webApiUrl = "http://renaissance.rbstech.in/api/";
     
$scope.branchApiUrl = angular.copy($scope.webApiUrl);
    $scope.$on('$includeContentLoaded', function () {
        handleSlimScroll();
    });
    $scope.$on('$viewContentLoaded', function () {
     
    $(window).scrollTop(0);
    });
    $scope.$on('$stateChangeStart', function () {
        // reset layout setting
        $rootScope.setting.layout.pageSidebarMinified = false;
        $rootScope.setting.layout.pageFixedFooter = false;
        $rootScope.setting.layout.pageRightSidebar = false;
        $rootScope.setting.layout.pageTwoSidebar = false;
        $rootScope.setting.layout.pageTopMenu = false;
        $rootScope.setting.layout.pageBoxedLayout = false;
        $rootScope.setting.layout.pageWithoutSidebar = false;
        $rootScope.setting.layout.pageContentFullHeight = false;
        $rootScope.setting.layout.pageContentFullWidth = false;
        $rootScope.setting.layout.paceTop = false;
        $rootScope.setting.layout.pageLanguageBar = false;
        $rootScope.setting.layout.pageSidebarTransparent = false;
        $rootScope.setting.layout.pageWideSidebar = false;
        $rootScope.setting.layout.pageLightSidebar = false;
        $rootScope.setting.layout.pageWithFooter = false;
        $rootScope.setting.layout.pageMegaMenu = false;
        $rootScope.setting.layout.pageWithoutHeader = false;
        $rootScope.setting.layout.pageBgWhite = false;
        $rootScope.setting.layout.pageContentInverseMode = false;
        App.scrollTop();
        $('.pace .pace-progress').addClass('hide');
        $('.pace').removeClass('pace-inactive');
    });
    $scope.$on('$stateChangeSuccess', function () {
        Pace.restart();
        App.initPageLoad();
        App.initSidebarSelection();
        App.initSidebarMobileSelection();
        setTimeout(function () {
            App.initLocalStorage();
            App.initComponent();
        }, 0);
        if ($('#top-menu').length !== 0) {
            $('#top-menu').removeAttr('style');
        }
    });
    $scope.$on('$stateNotFound', function () {
        Pace.stop();
    });
    $scope.$on('$stateChangeError', function () {
        Pace.stop();
    });
 var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
        $scope.error = function (message, isAutoHide) {
        if (app) {
        if(message!=null)
        {
        if(isAutoHide==false)
        {
        navigator.notification.alert(message);
        }
        else
        {
            window.plugins.toast.showWithOptions(
        {
            message: message,
            duration: 4000, // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
            position: "top",
            styling: {
                backgroundColor: '#F44336',
            }
        });
        }
}
}
          else
          {
          alert(message);
          }
    }

    $scope.success = function (message, isAutoHide) {

     if (app) {
     if(message!=null)
             {
             if(isAutoHide==false)
                     {
                     navigator.notification.alert(message);
                     }
                     else
                             {
        window.plugins.toast.showWithOptions(
  {
      message: message,
      duration: 4000, // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
      position: "top",
      styling: {
          backgroundColor: '#009688',
      }
  });
  }
  }

}
  else
  {
  alert(message);
  }
    }

    $scope.warning = function (message) {
     if (app) {
     if(message!=null)
             {
             if(isAutoHide==false)
              {
              navigator.notification.alert(message);
              }
              else
                      {
        window.plugins.toast.showWithOptions(
    {
        message: message,
        duration: 4000, // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
        position: "top",
        styling: {
            backgroundColor: '#FFC107',
        }
    }

  );
  }
  }
  }
      else
      {
      alert(message);
      }
    }
    $scope.schoolName;
    $scope.city;
     $scope.senderId;
    $scope.webUrl;
     $scope.$on("branchChanged", function (event, branchApiUrl) {
            $scope.webApiUrl = branchApiUrl;
            $scope.getSchoolDetail();
        });
         $scope.getSchoolDetail=function(){
$http.get($scope.webApiUrl + 'shared/GetSchoolDetail').success(function (result) {
        if (result == null) {
            $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
        }
        else {

            $scope.schoolName = result.data.schoolName;
            $scope.city = result.data.city;
            $scope.senderId = result.data.senderId;
            $scope.webUrl = result.data.webUrl;
            //$scope.backgroundImage = result.data.appBackgroundImagePath;
        }
    }).error(function (error, status) {
        $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
    });
}
    function showOffline() {
        $scope.error("There is no internet connection in your mobile. Please check your internet connection.", false);
    }

    function showOnline() {
        //$scope.success("You have proper internet connection. Go ahead and use the app.")
    }

  $scope.updateDeliveryStatus = function (alertMessageId, alertMessage) {

  $http.post($scope.webApiUrl + 'shared/SaveAlertDeliveryReport', JSON.stringify({custom1: alertMessageId,
                      status :'DELIVRD',
                      entityId: $scope.user.entityId,
                      roleId: $scope.user.roleId
                      })).success(function (result) {
//                            if($scope.isSpeakDone == false)
//                            {
//                            $scope.restartApp();
//                            }
                            //$scope.isSpeakDone = false;

                           }).error(function (error, status) {
                               $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
                           });
            }

        $scope.restartApp=function(){
        //cordova.plugins.diagnostic.restart(null, true);
            //navigator.app.exitApp();
            //navigator.app.loadUrl("file:///android_asset/www/index.html", {wait:2000, loadingDialog:"Wait,Loading App", loadUrlTimeoutValue: 60000});
          }

    $scope.isSpeakDone = true;
          $scope.speak = function (message) {
try
{
            window.TTS.speak({
                    text: message,
                    locale: 'en-IND',
                   rate: 0.75
                }, function () {

                    $scope.isSpeakDone = true;
                }, function (reason) {

                    $scope.isSpeakDone = true;
                });
}
catch(ex)
{}
                }

    document.addEventListener("offline", showOffline, false);
    document.addEventListener("online", showOnline, false);

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
    if (app) {
   // cordova.plugins.backgroundMode.enable();

    //cordova.plugins.backgroundMode.overrideBackButton();
    try
        {
   var channel = {
     id: "smartlogic_channel",
     name: "smartlogic",
     description: "SmartLogic Software Private Limited",
     sound:"mindage"
   };

   window.FirebasePlugin.setDefaultChannel(channel,
   function(){
       console.log('Default channel set');
   },
   function(error){
      console.log('Set default channel error: ' + error);
   });
   }
      catch(ex)
      {}
   }
       document.addEventListener("backbutton", function (e) {
       //$scope.success("");
       if($state.includes('member')){
               /*
                Event preventDefault/stopPropagation not required as adding backbutton
                 listener itself override the default behaviour. Refer below PhoneGap link.
               */
               //e.preventDefault();
               navigator.notification.confirm("Are you sure you want to exit ?", onConfirmExit, "Confirmation", "Yes,No");
           }
           else {
               navigator.app.backHistory()
           }

        }, false);
    }

        function onConfirmExit(button) {
            if(button==2){//If User selected No, then we just do nothing
                return;
            }
            else{
            //cordova.plugins.backgroundMode.moveToBackground();
                if (cordova && cordova.plugins)
{
    cordova.plugins.exit();
}
            }
        }

      if (app) {
      try
      {
             window.FirebasePlugin.onMessageReceived(function(data) {

              $scope.user = JSON.parse(window.localStorage.getItem("user"));

              $scope.updateDeliveryStatus(data.message_id, data.notification_body);
                  if(data.tap){
                   $scope.speak(data.notification_body);
                      $state.go('member.login', {redirectUrl:'app.'+ $scope.user.roleName.toLowerCase() +'.alert.alertReport'});

                     }
             }, function(error) {
                 console.error(error);
             });
             }
             catch(ex)
             {
             }
      }

       $scope.registerDevice = function (message) {
         if (app) {
               try {
                  window.FirebasePlugin.onTokenRefresh(function(fcmToken) {

                       $scope.user = JSON.parse(window.localStorage.getItem("user"));
                       $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
                       $scope.school = JSON.parse(window.localStorage.getItem("school"));
                       var phoneNumber = window.localStorage.getItem("phoneNumber");

                      $http.post($scope.webApiUrl + 'shared/SaveDevice', JSON.stringify({apiKey: $scope.school.appKey,
                      academicYearId: $scope.academicYear.academicYearId,entityId: $scope.user.entityId,
                      roleId: $scope.user.roleId,deviceId:fcmToken,phoneNumber: phoneNumber
                      })).success(function (result) {

                            if (result == null) {
                                $scope.error("An unhandled error has occurred. Please try after sometime, and contact your administrator if the problem persists.", true);
                                            }
                                            else {
                                                if (result.status == true) {
                                                    $scope.success(result.message, true);
                                                }
                                                else {
                                                    $scope.error(result.message, true);
                                                }
                                            }
                         }).error(function (error, status) {

                             $scope.error("An unhandled error has occurred. Please try after sometime, and contact your administrator if the problem persists.", true);
                         });
                  }, function(error) {
                      console.error(error);
                  });
              }
              catch (x) {
                  //$scope.error(x.message);
              }
         }
       }


         $scope.user = JSON.parse(window.localStorage.getItem("user"));
         $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
         $scope.school = JSON.parse(window.localStorage.getItem("school"));
         $scope.userscreen = JSON.parse(window.localStorage.getItem("userscreen"));


            $scope.formatDate = function (date) {

                month = '' + (date.getMonth() + 1),
                    day = '' + date.getDate(),
                    year = date.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                return [day, month, year].join('/');
            }
if(window.localStorage.getItem("branchApiUrl")!=null && window.localStorage.getItem("branchApiUrl")!="undefined")
 {
 $scope.webApiUrl = window.localStorage.getItem("branchApiUrl");
 $scope.getSchoolDetail();
 }
else
{
$scope.getSchoolDetail();
}

});
