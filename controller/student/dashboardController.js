colorAdminApp.controller('studentDashboardController', function ($scope, $rootScope, $http, $state) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.isAttendanceModule = $scope.school.schoolModules.filter(function (item) { return item == 1; }).length > 0;
    $scope.isFeeModule = $scope.school.schoolModules.filter(function (item) { return item == 2; }).length > 0;
    $scope.isExaminationModule = $scope.school.schoolModules.filter(function (item) { return item == 3; }).length > 0;
    $scope.isTransportModule = $scope.school.schoolModules.filter(function (item) { return item == 4; }).length > 0;
    $scope.isGPSModule = $scope.school.schoolModules.filter(function (item) { return item == 5; }).length > 0;
    $scope.isLibraryModule = $scope.school.schoolModules.filter(function (item) { return item == 9; }).length > 0;
    $scope.isAssignmentModule = $scope.school.schoolModules.filter(function (item) { return item == 12; }).length > 0;
    $scope.isCertificateModule = $scope.school.schoolModules.filter(function (item) { return item == 14; }).length > 0;
    $scope.getDashboardReport = function () {
        $http.get($scope.webApiUrl + 'student/GetDashboardReport?apiKey=' + $scope.school.appKey + '&studentId=' + $scope.user.entityId + "&academicYearId=" + $scope.academicYear.academicYearId
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

