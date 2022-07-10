colorAdminApp.controller('adminScreenController', function ($scope, $rootScope, $http, $state) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
     $scope.userscreen = JSON.parse(window.localStorage.getItem("userscreen"));
     $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
     $scope.school = JSON.parse(window.localStorage.getItem("school"));
     $scope.generalSetting = JSON.parse(window.localStorage.getItem("generalSetting"));
     window.localStorage.removeItem("selectedSearch");
     $scope.isAttendanceModule = $scope.userscreen.filter(function (item) { return item.moduleId == 1; }).length > 0;
       $scope.isFeeModule = $scope.userscreen.filter(function (item) { return item.moduleId == 2; }).length > 0;
       $scope.isExaminationModule = $scope.userscreen.filter(function (item) { return item.moduleId == 3; }).length > 0;
       $scope.isTransportModule = $scope.userscreen.filter(function (item) { return item.moduleId == 4; }).length > 0;
       $scope.isGPSModule = $scope.userscreen.filter(function (item) { return item.moduleId == 5; }).length > 0;
       $scope.isAlert = $scope.userscreen.filter(function (item) { return item.moduleId == 8; }).length > 0;
       $scope.isLibraryModule = $scope.userscreen.filter(function (item) { return item.moduleId == 9; }).length > 0;
       $scope.isAssignmentModule = $scope.userscreen.filter(function (item) { return item.moduleId == 12; }).length > 0;
       $scope.isCertificateModule = $scope.userscreen.filter(function (item) { return item.moduleId == 14; }).length > 0;
       $scope.isTimeTable = $scope.userscreen.filter(function (item) { return item.moduleId == 18; }).length > 0;
       $scope.isNotice =$scope.userscreen.filter(function (item) { return item.moduleId == 20; }).length > 0;
       $scope.isSmartClass = $scope.userscreen.filter(function (item) { return item.moduleId == 21; }).length > 0;
       $scope.isOnlineExamModule = $scope.userscreen.filter(function (item) { return item.moduleId == 22; }).length > 0;

       $scope.isEmployeeList = $scope.userscreen.filter(function (item) { return item.screenId == 130; }).length > 0;
       $scope.isStudentList = $scope.userscreen.filter(function (item) { return item.screenId == 131; }).length > 0;
       $scope.isExamination = $scope.userscreen.filter(function (item) { return item.screenId == 240; }).length > 0;
       $scope.isAssignment = $scope.userscreen.filter(function (item) { return item.screenId == 260; }).length > 0;
       $scope.isMarkAttendance = $scope.userscreen.filter(function (item) { return item.screenId == 153; }).length > 0;
       $scope.isSendAbsent = $scope.userscreen.filter(function (item) { return item.screenId == 154; }).length > 0;
   $scope.isClassCalendar = $scope.userscreen.filter(function (item) { return item.moduleId == 23; }).length > 0;
       $scope.isElearningModule = $scope.userscreen.filter(function (item) { return item.moduleId == 24; }).length > 0;
});

