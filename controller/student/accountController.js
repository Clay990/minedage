colorAdminApp.controller('studentAccountController', function ($scope, $rootScope, $http, $state, DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
    $scope.user = JSON.parse(window.localStorage.getItem("user"));
    $scope.academicYear = JSON.parse(window.localStorage.getItem("academicYear"));
    $scope.school = JSON.parse(window.localStorage.getItem("school"));
   
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
     function downloadAccountReceipt (voucherId) {
        debugger;
            $http.get($scope.webApiUrl + 'student/DownloadImprestAccountReceipt?apiKey=' + $scope.school.appKey + '&studentId=' + $scope.user.entityId + "&academicYearId=" + $scope.academicYear.academicYearId
              + '&voucherId=' + voucherId, { responseType: 'arraybuffer' }).success(function (result) {

                  var fileName = "ImprestAccountReceipt.pdf";

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







    function getAccountReport(sSource, aoData, fnCallback, oSettings) {

        var draw = aoData[0].value;
        $scope.draw = draw;
       $http.get($scope.webApiUrl + 'student/GetImprestAccountReport?apiKey=' + $scope.school.appKey + '&studentId=' + $scope.user.entityId+ "&academicYearId=" + $scope.academicYear.academicYearId).success(function (result) {
                       if (result.status == true) {
                           $scope.accountReport = result.data;
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
    $scope.orderOptions = DTOptionsBuilder.newOptions().withFnServerData(getAccountReport)
    .withOption('processing', false)
    .withOption('oLanguage', {
        "sZeroRecords": "No Notice Found.",
    }).withOption('responsive', true).withOption('paging', false).withOption('bFilter', false).withOption('info', false).withOption("ordering", false)
    .withOption('serverSide', true)
    .withPaginationType('full_numbers')
    .withOption('createdRow', createdRow)
         .withOption('autoWidth', false)
    .withBootstrap()

    $scope.orderColumns = [

               

                       DTColumnBuilder.newColumn("paymentDate", "Payment Date").withClass("f-s-600 text-inverse").withOption('name', 'Payment Date').renderWith(function (data, type, full) {
                            return $filter('date')(full.paymentDate.replace('/Date(', '').replace(')/', ''), 'dd MMM yyyy');
                       }),
                       DTColumnBuilder.newColumn("amount", "Amount").withClass("f-s-600 text-inverse").withOption('amount', 'Amount').renderWith(function (data, type, full) {
                           return full.amount;
                       }),
                       DTColumnBuilder.newColumn("balanceAmount", "Balance Amount").withClass("f-s-600 text-inverse").withOption('balanceAmount', 'Balance Amount').renderWith(function (data, type, full) {
                           return full.balanceAmount;
                       }),
                        DTColumnBuilder.newColumn(null).withClass("f-s-600 text-inverse").withOption("none").renderWith(function (data, type, full) {
           return '<button class="btn btn-success btn-icon btn-circle btn-sm" ng-click="downloadReceipt(' + data.voucherId + ')">' + ' <i class="fas fa-download"></i></button>';

                }),

    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    $scope.getAccountReport = function () {
        $scope.orderInstance.rerender();
    };
     $scope.downloadReceipt = function (voucherId) {
           downloadAccountReceipt(voucherId);
        }
  
});

