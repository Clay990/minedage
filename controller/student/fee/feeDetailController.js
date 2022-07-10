colorAdminApp.controller('feeDetailController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
   var startDate = new Date();
       $scope.endDate = $scope.formatDate(new Date());
       startDate.setDate(new Date().getDate() - 7);
       $scope.startDate = $scope.formatDate(startDate);
    $scope.draw;
    $scope.column;
    $scope.order;
    $scope.start;
    $scope.length;
    $scope.searchValue;

var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

    if (app) {
        var permissions = cordova.plugins.permissions;

        permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);

    }
function checkPermissionCallback(status) {
        if (!status.hasPermission) {
            var errorCallback = function () {
                console.warn('Storage permission is not turned on');
            }
            permissions.requestPermission(
              permissions.READ_EXTERNAL_STORAGE,
              function (status) {
                  if (!status.hasPermission) {
                      errorCallback();
                  } else {
                      // continue with downloading/ Accessing operation
                  }
              },
              errorCallback);
        }
    }
     function downloadFeeReceipt (feeCollectionId) {
        debugger;
            $http.get($scope.webApiUrl + 'student/DownloadFeeReceipt?apiKey=' + $scope.school.appKey + '&studentId=' + $scope.user.entityId + "&academicYearId=" + $scope.academicYear.academicYearId
              + '&feeCollectionId=' + feeCollectionId, { responseType: 'arraybuffer' }).success(function (result) {

                  var fileName = "FeeReceipt.pdf";

                  try {
                      window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function (directoryEntry) {

                          directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {

                              fileEntry.createWriter(function (fileWriter) {
                                  fileWriter.onwriteend = function (e) {
                                  cordova.plugins.fileOpener2.open(cordova.file.cacheDirectory  + fileName, 'application/pdf',
                                                          {
                                                              error: function (e) {
                                                                  console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                                                              },
                                                              success: function () {
                                                                  console.log('file opened successfully');
                                                              }
                                                          }
                                                      );
                                      $scope.success("Receipt has been downloaded successfully. Go to documents folder and view the downloaded file.", true);

                                  };

                                  fileWriter.onerror = function (e) {
                                      $scope.error(e, true);
                                  };

                                  //Blob erstellen - Blackberry File Plugin verwenden
                                  var blob = new Blob([result], { type: 'application/pdf' });
debugger;
                                  fileWriter.write(blob);

                              }, function onerror(e) {
                                      $scope.error(e, true);
                              });
                          }, function onerror(e) {
                                  $scope.error(e, true);
                          });
                      }, function onerror(e) {
                              $scope.error(e, true);
                      });

                  } catch (e) {
                      $scope.error(e, true);
                  }
              }).error(function (error, status) {
                  $scope.error("An unhandled error has occured. Please try after sometime, and contact your administrator if the problem persists.", true);
              });
        }









    function getFeePaymentDetail(sSource, aoData, fnCallback, oSettings) {
        var draw = aoData[0].value;
        $scope.draw = draw;
        $http.get($scope.webApiUrl + 'student/GetFeePaymentDetail?apiKey=' + $scope.school.appKey + '&studentId=' + $scope.user.entityId + "&academicYearId=" + $scope.academicYear.academicYearId +
            '&startDate=' + $scope.startDate + '&endDate=' + $scope.endDate).success(function (result) {
                if (result.status == true) {

                    $scope.feePaymentDetail = result.data;
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
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getFeePaymentDetail)
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

        DTColumnBuilder.newColumn("feeAmount", "Fee Amount").withOption('name', 'Fee Amount').withClass("f-s-600 text-inverse").renderWith(function (data, type, full) {
            var html = full.feeAmount;
            return html;

        }),
        DTColumnBuilder.newColumn("paymentAmount", "Payment Amount").withClass("f-s-600 text-inverse").withOption('name', 'Payment Amount').renderWith(function (data, type, full) {
            var html = full.paymentAmount;
            return html;
        }),
         DTColumnBuilder.newColumn(null).withClass("f-s-600 text-inverse").withOption("none").renderWith(function (data, type, full) {
           return '<button class="btn btn-success btn-icon btn-circle btn-sm" ng-click="downloadReceipt(' + data.feeCollectionId + ')">' + ' <i class="fas fa-download"></i></button>';

                }),
        DTColumnBuilder.newColumn("dueAmount", "Due Amount").withClass("none").withOption('name', 'Due Amount').renderWith(function (data, type, full) {
            return full.dueAmount;
        }),



        DTColumnBuilder.newColumn("actualPaymentDate", "Payment Date").withClass("none").withOption('name', 'Payment Date').renderWith(function (data, type, full) {
            return $filter('date')(full.actualPaymentDate.replace('/Date(', '').replace(')/', ''), 'dd/MMM/yyyy');
          
        }),
         DTColumnBuilder.newColumn("paymentModeName", "Payment Mode").withClass("none").withOption('name', 'Payment Mode').renderWith(function (data, type, full) {

             return full.paymentModeName;
         }),

        DTColumnBuilder.newColumn("chequeNumber", "Cheque Number").withClass("none").withOption('name', 'Cheque Number').renderWith(function (data, type, full) {

            return full.chequeNumber;
        }),

        DTColumnBuilder.newColumn("bankName", "Bank Name").withClass("none").withOption('name', 'Bank Name').renderWith(function (data, type, full) {

            return full.bankName;
        }),



    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getFeePaymentDetail = function () {
        $scope.orderInstance.rerender();
    };

     $scope.downloadReceipt = function (feeCollectionId) {
           downloadFeeReceipt(feeCollectionId);
        }

});

