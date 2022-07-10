colorAdminApp.controller('employeeDetailController', function ($scope, $rootScope, $http, $state, $stateParams,$compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));

    $scope.getEmployeeDetail = function () {

        $http.post($scope.webApiUrl + 'shared/GetEmployeeDetail', JSON.stringify({
            apiKey: $scope.school.appKey, employeeId: $stateParams.employeeId,
            academicYearId: $scope.academicYear.academicYearId

        })).success(function (result) {
            if (result.status == true) {

                $scope.employeeDetail = result.data;
                var records = {
                    'recordsTotal': result.recordsTotal,
                    'recordsFiltered': result.recordsFiltered,
                    'data': result.data
                };
            }
            else {
                $scope.error(result.message, true);
            }
        }).error(function (error, status) {
            $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
        });
    }
    $scope.getEmployeeDetail();
});

