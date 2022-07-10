colorAdminApp.controller('feePaymentController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile,$timeout) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
    $scope.generalSetting = JSON.parse(window.localStorage.getItem("generalSetting"));
    $scope.dateUpto = $scope.formatDate(new Date());

    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;
    $scope.finalFeeStructure = [ ];
   
    function getFeeCollectionForPayment(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.get($scope.webApiUrl + 'student/GetFeeCollectionForPayment?apiKey=' + $scope.school.appKey + '&studentId=' + $scope.user.entityId + '&classId=' + $scope.user.classId +'&dateUpto=' + $scope.dateUpto +"&academicYearId=" + $scope.academicYear.academicYearId
           ).success(function (result) {
                if (result.status == true) {
 debugger;
                    $scope.feeStructure = result.data;
                  
                    if ($scope.feeStructure.length > 0) {
                        $scope.finalFeeStructure = [];
                        var startDate = $scope.feeStructure[0].startDate;
                        var endDate = $scope.feeStructure[0].endDate;
                        $scope.finalFeeStructure.push({ startDate: startDate, endDate: endDate, isSelected:true, details:[] });
                        var i = 0;
                        angular.forEach($scope.feeStructure, function (item) {
                            if(item.startDate===startDate && item.endDate===endDate)
                            {
                             
                                $scope.finalFeeStructure[i].details.push({ feeTypeName: item.feeTypeName, feeParticularName: item.feeParticularName, paymentAmount: item.paymentAmount, feeCollectionDetailId: item.feeCollectionDetailId, isSelected:true  });
                            }
                            else
                            {
                                i = i + 1;
                              
                                startDate = item.startDate;
                                endDate = item.endDate;
                                $scope.finalFeeStructure.push({ startDate: startDate, endDate: endDate, isSelected:true, details: [] });
                                $scope.finalFeeStructure[i].details.push({ feeTypeName: item.feeTypeName, feeParticularName: item.feeParticularName, paymentAmount: item.paymentAmount, feeCollectionDetailId: item.feeCollectionDetailId, isSelected:true });
                            }
                        });

                        var records = {
                            'draw': draw,
                            'data': $scope.finalFeeStructure
                        };
                        fnCallback(records);
                    }
                }
                else {
                    $scope.error(result.message, true);
                }
            }).error(function (error, status) {
                $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
            });

    }

    $scope.orderInstance = {};
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getFeeCollectionForPayment)
        .withOption('processing', false)
        .withOption('oLanguage', {
            "sZeroRecords": "No Record Found.",
        }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
        .withOption('serverSide', true)
         .withOption('createdRow', createdRow)
        .withOption('autoWidth', false)
        .withBootstrap()

    $scope.orderColumns = [

        DTColumnBuilder.newColumn("startDate", "Start Date").withClass("f-s-600 text-inverse").withOption('name', 'Start Date').renderWith(function (data, type, full) {
            return $filter('date')(full.startDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');
            return html;
        }),
        DTColumnBuilder.newColumn("endDate", "End Date").withClass("f-s-600 text-inverse").withOption('name', 'End Date').renderWith(function (data, type, full) {
            return $filter('date')(full.endDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');
            return html;
        }),
        DTColumnBuilder.newColumn("paymentAmount", "Amount").withClass("f-s-600 text-inverse").withOption('name', 'Amount').renderWith(function (data, type, full) {
          var html;

          var feePayAmount=0;
                angular.forEach(full.details, function (item) {
                   feePayAmount+= item.paymentAmount;
                });
                  html = feePayAmount ;
                return html;
            }),

        DTColumnBuilder.newColumn(null).withClass("f-s-600 text-inverse").withOption('name', 'Details').renderWith(function (data, type, full, meta) {

          var html = '<div class="switcher checkbox-css"><input type="checkbox" id=checkbox_' + meta.row +' ng-model="finalFeeStructure['+meta.row+'].isSelected"  /><label for=checkbox_'+ meta.row +'></label></div>';

          return html;
          }),
       
      DTColumnBuilder.newColumn(null).withClass("none").withOption('name', 'Details').renderWith(function (data, type, full, meta) {

          var html = '<table class="table table-striped table-bordered"><thead><tr class="bg-inverse text-white f-w-600"><td>Particular</td><td>Amount</td></tr></thead>';
          angular.forEach(full.details, function (item, detailIndex) {
              html = html + ' <tr id=tr_' + meta.row + '_'+detailIndex +'><td>' + item.feeParticularName + '</td><td>' + item.paymentAmount + '</td>';
              html=html+'</tr>';
          });

          return html;
      }),

    ];

   $scope.toggleFeeCollection = function(parentIndex, index) {

        }

    function createdRow(row, data, dataIndex) {

        $compile(angular.element(row).contents())($scope);
    }

    $scope.getFeeCollectionForPayment = function () {
        $scope.orderInstance.rerender();
    };

 $scope.$watch('finalFeeStructure', function () {
            $scope.totalFeeAmount = 0;

            angular.forEach($scope.finalFeeStructure, function (f, parentIndex) {
            angular.forEach(f.details, function (item, index) {

            if(f.isSelected==true)
            {

                        $scope.totalFeeAmount = $scope.totalFeeAmount + item.paymentAmount;
                        }

                        });

            });

        }, true);



     $scope.feePayment = function () {
       var selectedItems = [];
angular.forEach($scope.finalFeeStructure, function (f, i) {
  
            if(f.isSelected==true)
            {
              selectedItems.push(i+1);
            }

            });
           if (selectedItems[selectedItems.length - 1] == selectedItems.length) {
                    var feeCollectionDetailIds=[];
     var feeCollectionDetailList = $scope.finalFeeStructure.filter(function (item) {
                                        return item.isSelected === true;
                                    });
                                    angular.forEach(feeCollectionDetailList, function (item) {
                                    angular.forEach(item.details, function (x) {
                                    feeCollectionDetailIds.push(x.feeCollectionDetailId);
                                    });

                                });

    window.location.href =$scope.generalSetting.gateWayUrl+'?apiKey=' + $scope.school.appKey + '&entityId=' + $scope.user.entityId + '&roleId=' + $scope.user.roleId +'&feeCollectionDetailIds=' + feeCollectionDetailIds.join() +"&academicYearId=" + $scope.academicYear.academicYearId;
                }
                else {
                    $scope.error("You can't pay future payments without making previous payments. Please select months in order.");
                    return false;
                }
       }
});

