colorAdminApp.controller('adminSmartClassController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.endDate = $scope.formatDate(new Date());
    $scope.startDate = $scope.formatDate(new Date());
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;


    function getSmartClassCalendar(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.get($scope.webApiUrl + 'shared/GetSmartClassCalendar?apiKey=' + $scope.school.appKey + '&entityId=' + $scope.user.entityId + '&roleId=' + $scope.user.roleId +  "&academicYearId=" + $scope.academicYear.academicYearId +
            '&startDate=' + $scope.startDate + '&endDate=' + $scope.endDate).success(function (result) {
                if (result.status == true) {
                    $scope.smartClassCalendar = result.data;
                    var records = {
                        'draw': draw,
                        'recordsTotal': result.recordsTotal,
                        'recordsFiltered': result.recordsFiltered,
                        'data': result.data
                    };
                    fnCallback(records);
                }
                else {
                    $scope.error(result.message, true);
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
            });

    }

    $scope.orderInstance = {};
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getSmartClassCalendar)
        .withOption('processing', false)
        .withOption('oLanguage', {
            "sZeroRecords": "No Record Found.",
        }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers')
        .withOption('createdRow', createdRow)
        .withOption('autoWidth', false)
        .withBootstrap()

    $scope.orderColumns = [

        DTColumnBuilder.newColumn("date", "Date").withClass("f-s-600 text-inverse").withOption('name', 'Date').renderWith(function (data, type, full) {
            return $filter('date')(full.date.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');
            return html;
        }),
         DTColumnBuilder.newColumn("startTime", "Start Time").withOption('name', 'Start Time').renderWith(function (data, type, full) {
                   var html = full.startTime;
                   return html;

               }),
         DTColumnBuilder.newColumn("endTime", "End Time").withOption('name', 'End Time').renderWith(function (data, type, full) {
                          var html = full.endTime;
                          return html;

                      }),
          DTColumnBuilder.newColumn("className", "Class").withClass("none").withOption('name', 'Class').renderWith(function (data, type, full) {
                              var html = full.className+' '+full.sectionName;
                              return html;

                          }),

          DTColumnBuilder.newColumn("description", "Description").withClass("none").withOption('name', 'Description').renderWith(function (data, type, full) {
                    var html = full.description;
                    return html;

                }),

     DTColumnBuilder.newColumn("subjectName", "Subject").withClass("none").withOption('name', 'Subject').renderWith(function (data, type, full) {
                var html = full.subjectName;
                return html;

            }),

        DTColumnBuilder.newColumn("meetingLink", "").withClass("none").renderWith(function (data, type, full) {

               var  html ='';
               if(full.meetingLink!=null && full.meetingLink!='' && full.meetingLink.startsWith("http")){
                 return html + "<b>To Join/Attend <a href='" + full.meetingLink +"'>Click Here</a></b>";

               }
                else{
                  return full.meetingLink
                }


               }),

            DTColumnBuilder.newColumn(null).withClass("none").withOption('name', 'Download Recording').renderWith(function (data, type, full) {
                       var html = "<table>";
                        if(full.recordingLink!=null && full.recordingLink!=''){
                       angular.forEach(full.recordingLink.split(','), function (item) {


                           html = html +  " <tr><td><i class='fa fa-play'>  Click <a href='" + item + "'>here</a> for recording.</i></td></tr>";
                       });
                       }
                       html = html + "</table>";
                       return html;
                   })

    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getSmartClassCalendar = function () {
        $scope.orderInstance.rerender();
    };

});

