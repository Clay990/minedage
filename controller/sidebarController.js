colorAdminApp.controller('sidebarController', function ($scope, $rootScope, $state, $http) {

    $scope.user = JSON.parse(window.localStorage.getItem("user"));
     $scope.userscreen = JSON.parse(window.localStorage.getItem("userscreen"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.isAttendanceModule = $scope.userscreen.filter(function (item) { return item.moduleId == 1; }).length > 0;
    $scope.isFeeModule = $scope.userscreen.filter(function (item) { return item.moduleId == 2; }).length > 0;
    $scope.isExaminationModule = $scope.userscreen.filter(function (item) { return item.moduleId == 3; }).length > 0;
    $scope.isTransportModule = $scope.userscreen.filter(function (item) { return item.moduleId == 4; }).length > 0;
    $scope.isGPSModule = $scope.userscreen.filter(function (item) { return item.moduleId == 5; }).length > 0;
    $scope.isLibraryModule = $scope.userscreen.filter(function (item) { return item.moduleId == 9; }).length > 0;
    $scope.isAssignmentModule = $scope.userscreen.filter(function (item) { return item.moduleId == 12; }).length > 0;
    $scope.isOnlineExamModule = $scope.userscreen.filter(function (item) { return item.moduleId == 22; }).length > 0;
    $scope.isCertificateModule = $scope.userscreen.filter(function (item) { return item.moduleId == 14; }).length > 0;
    $scope.isTimeTable = $scope.userscreen.filter(function (item) { return item.moduleId == 18; }).length > 0;
    $scope.isNotice = $scope.userscreen.filter(function (item) { return item.moduleId == 20; }).length > 0;
    $scope.isNotice = $scope.userscreen.filter(function (item) { return item.moduleId == 24; }).length > 0;

   $scope.isEmployeeList = $scope.userscreen.filter(function (item) { return item.screenId == 130; }).length > 0;
   $scope.isStudentList = $scope.userscreen.filter(function (item) { return item.screenId == 131; }).length > 0;
   $scope.isExamination = $scope.userscreen.filter(function (item) { return item.screenId == 240; }).length > 0;
   $scope.isAssignment = $scope.userscreen.filter(function (item) { return item.screenId == 260; }).length > 0;
   $scope.isMarkAttendance = $scope.userscreen.filter(function (item) { return item.screenId == 153; }).length > 0;
   $scope.isSendAbsent = $scope.userscreen.filter(function (item) { return item.screenId == 154; }).length > 0;
   $scope.isSendAppAlert = $scope.userscreen.filter(function (item) { return item.screenId == 189; }).length > 0;
   $scope.isPaymentSummary = $scope.userscreen.filter(function (item) { return item.screenId == 210; }).length > 0;
   $scope.isElearningModule = $scope.userscreen.filter(function (item) { return item.screenId == 15002; }).length > 0;

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


if($scope.user.roleId==5)
{
    $http.get($scope.webApiUrl + 'student/getAssessment?apiKey=' + $scope.school.appKey + '&classId=' + $scope.user.classId + "&academicYearId=" + $scope.academicYear.academicYearId
           ).success(function (result) {
               if (result.status == true) {
                   $scope.assessments = result.data;
               }
               else {
                   $scope.error(result.message, true);
               }
           }).error(function (error, status) {
               $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
           });
}
    $scope.assessmentResult = function (assessment) {
        $state.go("app.examination.assessmentResult", { assessment: assessment });
    }

    angular.element(document).ready(function () {
        App.initSidebar();
    });
$scope.changeBranch = function (branch) {
      window.localStorage.setItem("branchApiUrl", branch.apiUrl);
        
            $rootScope.$broadcast("branchChanged", branch.apiUrl);
$state.go("member.login");
    }
    $scope.logOut = function () {
    //cordova.plugins.backgroundMode.moveToBackground();
        navigator.app.exitApp();
        //$state.go('member.login');
    };
    $scope.clearLogout = function () {
        window.localStorage.removeItem("userName");
        window.localStorage.removeItem("password");
        window.localStorage.removeItem("isSimNumber");
        $scope.logOut();
    }
});