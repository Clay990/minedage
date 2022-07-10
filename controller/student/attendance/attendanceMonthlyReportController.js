colorAdminApp.controller('studentsAttendanceMonthlyReportController', function ($scope, $rootScope, $http, $state) {
   $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.attendanceDays = [];

    $scope.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $scope.dayNames = ["S", "M", "T", "W", "T", "F", "S"];


    $scope.date = new Date();
    $scope.month = $scope.date.getMonth() + 1,
        $scope.year = $scope.date.getFullYear();
        $scope.selectedMonth = '01' + '/' + ($scope.month>9?$scope.month:'0'+$scope.month.toString()) + '/' + $scope.year;

        $scope.events = [];

    $scope.getAttendanceMonthlyReport = function () {
    


        $http.get($scope.webApiUrl + 'student/GetAttendanceMonthlyReport?apiKey=' + $scope.school.appKey + '&studentId=' + $scope.user.entityId + "&academicYearId=" + $scope.academicYear.academicYearId +
           '&month=' + $scope.selectedMonth).success(function (result) {
               $scope.attendanceDays = [];
               if (result.status == true) {
                   $scope.events = [];
                   $scope.attendanceMonthlyReport = result.data[0];
                   if ($scope.attendanceMonthlyReport != null) {
                       $scope.events = [
                           [
                               '1/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                               $scope.attendanceMonthlyReport.d1 == "N" || $scope.attendanceMonthlyReport.d1 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d1 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d1 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d1 == "N" || $scope.attendanceMonthlyReport.d1 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d1 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d1 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '2/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                                $scope.attendanceMonthlyReport.d2 == "N" || $scope.attendanceMonthlyReport.d2 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d2 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d2 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d2 == "N" || $scope.attendanceMonthlyReport.d2 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d2 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d2 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '3/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                               $scope.attendanceMonthlyReport.d3 == "N" || $scope.attendanceMonthlyReport.d3 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d3 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d3 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d3 == "N" || $scope.attendanceMonthlyReport.d3 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d3 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d3 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '4/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                                $scope.attendanceMonthlyReport.d4 == "N" || $scope.attendanceMonthlyReport.d4 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d4 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d4 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d4 == "N" || $scope.attendanceMonthlyReport.d4 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d4 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d4 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '5/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                                $scope.attendanceMonthlyReport.d5 == "N" || $scope.attendanceMonthlyReport.d5 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d5 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d5 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d5 == "N" || $scope.attendanceMonthlyReport.d5 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d5 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d5 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '6/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                                $scope.attendanceMonthlyReport.d6 == "N" || $scope.attendanceMonthlyReport.d6 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d6 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d6 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d6 == "N" || $scope.attendanceMonthlyReport.d6 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d6 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d6 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '7/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                                $scope.attendanceMonthlyReport.d7 == "N" || $scope.attendanceMonthlyReport.d7 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d7 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d7 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d7 == "N" || $scope.attendanceMonthlyReport.d7 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d7 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d7 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '8/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                                $scope.attendanceMonthlyReport.d8 == "N" || $scope.attendanceMonthlyReport.d8 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d8 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d8 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d8 == "N" || $scope.attendanceMonthlyReport.d8 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d8 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d8 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '9/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                                $scope.attendanceMonthlyReport.d9 == "N" || $scope.attendanceMonthlyReport.d9 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d9 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d9 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d9 == "N" || $scope.attendanceMonthlyReport.d9 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d9 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d9 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '10/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                                $scope.attendanceMonthlyReport.d10 == "N" || $scope.attendanceMonthlyReport.d10 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d10 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d10 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d10 == "N" || $scope.attendanceMonthlyReport.d10 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d10 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d10 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '11/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                               $scope.attendanceMonthlyReport.d11 == "N" || $scope.attendanceMonthlyReport.d11 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d11 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d11 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d11 == "N" || $scope.attendanceMonthlyReport.d11 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d11 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d11 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '12/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                               $scope.attendanceMonthlyReport.d12 == "N" || $scope.attendanceMonthlyReport.d12 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d12 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d12 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d12 == "N" || $scope.attendanceMonthlyReport.d12 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d12 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d12 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '13/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                              $scope.attendanceMonthlyReport.d13 == "N" || $scope.attendanceMonthlyReport.d13 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d13 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d13 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d13 == "N" || $scope.attendanceMonthlyReport.d13 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d13 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d13 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '14/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                                $scope.attendanceMonthlyReport.d14 == "N" || $scope.attendanceMonthlyReport.d14 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d14 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d14 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d14 == "N" || $scope.attendanceMonthlyReport.d14 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d14 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d14 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '15/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                                $scope.attendanceMonthlyReport.d15 == "N" || $scope.attendanceMonthlyReport.d15 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d15 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d15 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d15 == "N" || $scope.attendanceMonthlyReport.d15 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d15 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d15 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '16/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                              $scope.attendanceMonthlyReport.d16 == "N" || $scope.attendanceMonthlyReport.d16 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d16 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d16 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d16 == "N" || $scope.attendanceMonthlyReport.d16 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d16 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d16 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '17/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                               $scope.attendanceMonthlyReport.d17 == "N" || $scope.attendanceMonthlyReport.d17 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d17 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d17 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d17 == "N" || $scope.attendanceMonthlyReport.d17 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d17 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d17 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '18/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                               $scope.attendanceMonthlyReport.d18 == "N" || $scope.attendanceMonthlyReport.d18 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d18 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d18 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d18 == "N" || $scope.attendanceMonthlyReport.d18 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d18 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d18 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '19/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                               $scope.attendanceMonthlyReport.d19 == "N" || $scope.attendanceMonthlyReport.d19 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d19 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d19 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d19 == "N" || $scope.attendanceMonthlyReport.d19 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d19 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d19 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '20/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                               $scope.attendanceMonthlyReport.d20 == "N" || $scope.attendanceMonthlyReport.d20 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d20 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d20 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d20 == "N" || $scope.attendanceMonthlyReport.d20 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d20 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d20 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '21/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                               $scope.attendanceMonthlyReport.d21 == "N" || $scope.attendanceMonthlyReport.d21 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d21 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d21 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d21 == "N" || $scope.attendanceMonthlyReport.d21 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d21 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d21 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '22/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                              $scope.attendanceMonthlyReport.d22 == "N" || $scope.attendanceMonthlyReport.d22 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d22 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d22 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d22 == "N" || $scope.attendanceMonthlyReport.d22 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d22 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d22 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '23/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                                $scope.attendanceMonthlyReport.d23 == "N" || $scope.attendanceMonthlyReport.d23 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d23 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d23 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d23 == "N" || $scope.attendanceMonthlyReport.d23 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d23 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d23 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '24/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                                $scope.attendanceMonthlyReport.d24 == "N" || $scope.attendanceMonthlyReport.d24 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d24 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d24 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d24 == "N" || $scope.attendanceMonthlyReport.d24 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d24 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d24 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '25/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                               $scope.attendanceMonthlyReport.d25 == "N" || $scope.attendanceMonthlyReport.d25 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d25 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d25 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d25 == "N" || $scope.attendanceMonthlyReport.d25 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d25 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d25 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '26/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                               $scope.attendanceMonthlyReport.d26 == "N" || $scope.attendanceMonthlyReport.d26 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d26 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d26 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d26 == "N" || $scope.attendanceMonthlyReport.d26 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d26 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d26 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '27/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                               $scope.attendanceMonthlyReport.d27 == "N" || $scope.attendanceMonthlyReport.d27 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d27 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d27 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d27 == "N" || $scope.attendanceMonthlyReport.d27 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d27 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d27 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '28/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                           $scope.attendanceMonthlyReport.d28 == "N" || $scope.attendanceMonthlyReport.d28 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d28 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d28 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d28 == "N" || $scope.attendanceMonthlyReport.d28 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d28 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d28 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '29/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                               $scope.attendanceMonthlyReport.d29 == "N" || $scope.attendanceMonthlyReport.d29 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d29 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d29 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d29 == "N" || $scope.attendanceMonthlyReport.d29 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d29 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d29 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '30/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                              $scope.attendanceMonthlyReport.d30 == "N" || $scope.attendanceMonthlyReport.d30 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d30 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d30 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d30 == "N" || $scope.attendanceMonthlyReport.d30 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d30 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d30 == "P" ? "PRESENT" : "HOLIDAY"
                           ],
                           [
                               '31/' + $scope.month + '/' + $scope.year,
                               'Status',
                               '#',
                               $scope.attendanceMonthlyReport.d31 == "N" || $scope.attendanceMonthlyReport.d31 == "" ? COLOR_BLUE : $scope.attendanceMonthlyReport.d31 == "A" ? COLOR_RED : $scope.attendanceMonthlyReport.d31 == "P" ? COLOR_GREEN : COLOR_YELLOW,
                               $scope.attendanceMonthlyReport.d31 == "N" || $scope.attendanceMonthlyReport.d31 == "" ? "NOT APPLICABLE" : $scope.attendanceMonthlyReport.d31 == "A" ? "ABSENT" : $scope.attendanceMonthlyReport.d31 == "P" ? "PRESENT" : "HOLIDAY"
                           ]
                       ];
                   }
                   else
                   {
                       $scope.attendanceMonthlyReport = { absent: 0, present: 0, holiday: 0, notApplicable: 0 };
                   }
                   var calendarTarget = $('#schedule-calendar');
                   $(calendarTarget).calendar({
                       months: $scope.monthNames,
                       days: $scope.dayNames,
                       date: $scope.date,
                       events: $scope.events,
                       popover_options: {
                           placement: 'top',
                           html: true
                       }
                   });
                   $(calendarTarget).find('td.event').each(function () {
                       var backgroundColor = $(this).css('background-color');
                       $(this).removeAttr('style');
                       $(this).find('a').css('background-color', backgroundColor);
                   });
                   $(calendarTarget).find('.icon-arrow-left, .icon-arrow-right').parent().on('click', function () {
                       $(calendarTarget).find('td.event').each(function () {
                           var backgroundColor = $(this).css('background-color');
                           $(this).removeAttr('style');
                           $(this).find('a').css('background-color', backgroundColor);
                       });
                   });
               }
               else {
                   $scope.error(result.message, true);
               }
           }).error(function (error, status) {
               $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
           });

    };

    $scope.changeMonth = function (month, year) {
        $scope.date = new Date(year, month, 1);
        $scope.month = $scope.date.getMonth() + 1,
        $scope.year = $scope.date.getFullYear();
        $scope.selectedMonth = '01' + '/' + ($scope.month>9?$scope.month:'0'+$scope.month.toString()) + '/' + $scope.year;
         $('#schedule-calendar').empty();
        $scope.getAttendanceMonthlyReport();
    };
    $scope.getAttendanceMonthlyReport();
});

