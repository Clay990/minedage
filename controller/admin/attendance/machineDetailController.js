colorAdminApp.controller('machineDetailController', function ($scope, $rootScope, $http, $state, $stateParams,$compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));

    $scope.getMachineDetail = function () {

        $http.post($scope.webApiUrl + 'admin/GetMachineDetail', JSON.stringify({
            apiKey: $scope.school.appKey, machineMasterId: $stateParams.machineMasterId,
            academicYearId: $scope.academicYear.academicYearId

        })).success(function (result) {
            if (result.status == true) {

                $scope.machineDetail = result.data;
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
    $scope.getMachineDetail();
});

