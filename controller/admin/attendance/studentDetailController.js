colorAdminApp.controller('adminStudentDetailController', function ($scope, $rootScope, $http, $state, $stateParams,$compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));

    $scope.getStudentDetail = function () {
     
        $http.post($scope.webApiUrl + 'shared/GetStudentDetail', JSON.stringify({
            apiKey: $scope.school.appKey, studentId: $stateParams.studentId,
            academicYearId: $scope.academicYear.academicYearId

        })).success(function (result) {
            if (result.status == true) {
               
                $scope.studentDetail = result.data;
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
    $scope.getStudentDetail();
});

