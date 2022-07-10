colorAdminApp.controller('headerController', function ($scope, $rootScope, $state, $http, $window) {

    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.selectedAcademicYear = { activeAcademicYear: null };
    $scope.selectedAcademicYear.activeAcademicYear = { text: $scope.academicYear.academicYearName, value: $scope.academicYear.academicYearId };
    $scope.branches=[];
     $scope.branch={};
     $scope.isSchoolCode=false;
     $http.get($scope.webApiUrl + 'shared/GetBranches').success(function (result)
         {
              if (result == null) {
                             $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", false);
                         }
                         else {

                             if (result.status == true) {
                                 $scope.branches = result.data;
                                 if($scope.branches.length>0)
                                 {
                                  $scope.isSchoolCode = $scope.branches[0].branchName=="MINDAGE"? true:false;
                                $scope.branch.selectedBranch = $scope.branches.filter(function (item) { return item.apiUrl == $scope.webApiUrl; })[0];
                                 }
                           }
                             else {
                                 $scope.error(result.message, false);
                             }
                         }
                     }).error(function (error, status) {
                         $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", false);
                     });
    $http.get($scope.webApiUrl + 'shared/GetAcademicYears?apiKey=' + $scope.school.appKey + '&academicYearId=' + $scope.academicYear.academicYearId + '&entityId=' + $scope.user.entityId + '&roleId=' + $scope.user.roleId).success(function (result) {
        if (result == null) {
            $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
        }
        else {
            if (result.status == true) {

                $scope.academicYears = result.data;
                $scope.selectedAcademicYear.activeAcademicYear = { text: $scope.academicYear.academicYearName, value: $scope.academicYear.academicYearId };

            }
            else {
                $scope.error(result.message, true);
            }
        }
    }).error(function (error, status) {
        $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
    });
    $scope.goToHome=function(user)
    {
      $state.go("app."+user.roleName.toLowerCase()+".screen");
    }
    
$scope.changeBranch = function (branch) {
      window.localStorage.setItem("branchApiUrl", branch.apiUrl);

            $rootScope.$broadcast("branchChanged", branch.apiUrl);
$state.go("member.login");
    }
    $scope.changeAcademicYear = function (academicYear) {
        
        $http.post($scope.webApiUrl + 'shared/ChangeAcademicYear',
            JSON.stringify({apiKey: $scope.school.appKey,
                      academicYearId :$scope.academicYear.academicYearId,
                      loginId: $scope.user.loginId,
                      changeAcademicYearId: academicYear.value
                      })).success(function (result) {
                if (result == null) {
                    $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
                }
                else {
                    if (result.status == true) {
                        window.localStorage.setItem("user", JSON.stringify(result.data));
                        window.localStorage.setItem("academicYear", JSON.stringify(result.data1));
                        window.localStorage.setItem("school", JSON.stringify(result.data2));
                        window.localStorage.setItem("userscreen", JSON.stringify(result.userScreen));
                        window.localStorage.setItem("generalSetting", JSON.stringify(result.data3));
                        $scope.user = JSON.parse(window.localStorage.getItem("user"));
                        $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
                        $scope.school = JSON.parse(window.localStorage.getItem("school"));
                        $scope.userscreen = JSON.parse(window.localStorage.getItem("userscreen"));
                        $scope.generalSetting = JSON.parse(window.localStorage.getItem("generalSetting"));
                        //$rootScope.$broadcast("academicYearChanged");
                        $state.go('app.'+result.data.roleName.toLowerCase()+'.screen', {}, {reload: true});
                    }
                    else {
                        $scope.error(result.message, true);
                    }
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
            });
    };

    $scope.logOut = function () {
    if (cordova && cordova.plugins)
{
    cordova.plugins.exit();
}
    };

    $scope.clearLogout = function () {
    debugger;
        window.localStorage.removeItem("branchApiUrl");
        window.localStorage.removeItem("selectedSearch");
        window.localStorage.removeItem("userName");
        window.localStorage.removeItem("password");
        //window.localStorage.removeItem("phoneNumber");
        window.localStorage.removeItem("isSimNumber");
         $rootScope.$broadcast("branchChanged", $scope.branchApiUrl);

        $scope.logOut();
    }

});
