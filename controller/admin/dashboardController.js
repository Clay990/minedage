colorAdminApp.controller('adminDashboardController', function ($scope, $rootScope, $http, $state) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.userscreen = JSON.parse(window.localStorage.getItem("userscreen"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.isAttendanceModule = $scope.userscreen.filter(function (item) { return item.moduleId == 1; }).length > 0;
    $scope.isFeeModule =$scope.userscreen.filter(function (item) { return item.moduleId == 2; }).length > 0;
    $scope.isExaminationModule = $scope.userscreen.filter(function (item) { return item.moduleId == 3; }).length > 0;
    $scope.isTransportModule = $scope.userscreen.filter(function (item) { return item.moduleId == 4; }).length > 0;
    $scope.isGPSModule = $scope.userscreen.filter(function (item) { return item.moduleId == 5; }).length > 0;
    $scope.isLibraryModule = $scope.userscreen.filter(function (item) { return item.moduleId == 9; }).length > 0;
    $scope.isAssignmentModule = $scope.userscreen.filter(function (item) { return item.moduleId == 12; }).length > 0;
    $scope.isCertificateModule = $scope.userscreen.filter(function (item) { return item.moduleId == 14; }).length > 0;

    $scope.isMachineList = $scope.userscreen.filter(function (item) { return item.screenId == 91; }).length > 0;
     $scope.isPaymentSummary = $scope.userscreen.filter(function (item) { return item.screenId == 210; }).length > 0;

    $scope.getDashboardReport = function () {

        $http.get($scope.webApiUrl + 'admin/GetDashboardReport?apiKey=' + $scope.school.appKey + '&adminId=' + $scope.user.entityId + "&academicYearId=" + $scope.academicYear.academicYearId
           ).success(function (result) {
                 if (result.status == true) {
                    $scope.dashboardReport = result.data;
              
                }
                else {
                     $scope.error(result.message, true);
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
            });
    };

    $scope.getDashboardReport();

});

