colorAdminApp.controller('branchController', function($scope, $rootScope, $state, $http, $q, $stateParams, $timeout) {
    $rootScope.setting.layout.pageWithoutHeader = true;
    $rootScope.setting.layout.paceTop = true;
    $scope.branches = [];
    $scope.branch = {};
    $scope.isSchoolCode = false;
    $scope.school = {};

    var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

    if (window.localStorage.getItem("branchApiUrl") != null && window.localStorage.getItem("branchApiUrl") != "undefined") {
        $state.go("member.phonenumber");
        if (app) {

        } else {

        }
    }

    $scope.submitBranch = function() {

        if ($scope.branchForm.$invalid) {
            angular.forEach($scope.branchForm.$error, function(field) {
                angular.forEach(field, function(errorField) {
                    errorField.$setTouched();
                });
            });
            angular.element("[name='" + $scope.branchForm.$name + "']").find('.ng-invalid:visible:first').focus();
        }
        if ($scope.branchForm.$valid) {
            var apiUrl = "";
            if ($scope.isSchoolCode == true) {
                debugger;
                var s = $scope.branches.filter(function(item) { return item.branchName == $scope.school.schoolCode; });
                if (s.length > 0) {
                    apiUrl = s[0].apiUrl;
                } else {
                    alert();
                    return;
                }
            } else {
                apiUrl = $scope.branch.selectedBranch.apiUrl;
            }
            window.localStorage.setItem("branchApiUrl", apiUrl);
            $rootScope.$broadcast("branchChanged", apiUrl);
            $state.go("member.phonenumber");
        };
    };

    $http.get($scope.webApiUrl + 'shared/GetBranches').success(function(result) {
        debugger;
        if (result == null) {
            $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", false);
        } else {

            if (result.status == true) {
                $scope.branches = result.data;
                if ($scope.branches.length > 0)
                    $scope.isSchoolCode = $scope.branches[0].branchName == "MINDAGE" ? true : false;
                if ($scope.branches.length < 2) {
                    $state.go("member.phonenumber");
                }
            } else {
                $scope.error(result.message, false);
            }
        }
    }).error(function(error, status) {
        $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", false);
    });
});