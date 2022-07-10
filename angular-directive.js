/*
Template Name: Color Admin - Responsive Admin Dashboard Template build with Twitter Bootstrap 3.3.7 & Bootstrap 4.0.0-Alpha 6
Version: 3.0.0
Author: Sean Ngu
Website: http://www.seantheme.com/color-admin-v3.0/admin/angularjs/
*/

/* Prevent Global Link Click
------------------------------------------------ */

colorAdminApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault();
                });
            }
        }
    };
}).directive('selectpicker', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var $el = $(element);

            scope.$watch(attrs.selectpickerOptions, function (opts) {

                            if (opts) {
                                $timeout(function () {
                                    $el.selectpicker({
                                        style: 'btn-success',
                                        size: false
                                    });
                                    $el.selectpicker('refresh');

                                },1000);
                            }
                        })
        }
    };
}).directive('selectpickerlarge', function ($timeout) {
      return {
          restrict: 'A',
          link: function (scope, element, attrs) {

              var $el = $(element);

              scope.$watch(attrs.selectpickerOptions, function (opts) {

                              if (opts) {
                                  $timeout(function () {
                                      $el.selectpicker({
                                          style: 'btn-success btn-lg',
                                          size: false
                                      });
                                      $el.selectpicker('refresh');

                                  },1000);
                              }
                          })
          }
      };
  }).directive('bootstrapdatepicker', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var $el = $(element);

            var unsubscribe = scope.$watch(attrs.ngModel, function (opts) {
                if (opts) {
                    $timeout(function () {
                        $el.datepicker({
                            todayHighlight: true,
                            autoclose: true,
                            format: 'dd/mm/yyyy',
                        });
                        unsubscribe();
                    });
                }
            })

        }
    };
}).directive('bootstraptimepicker', function ($timeout) {
      return {
          restrict: 'A',
          link: function (scope, element, attrs) {

              var $el = $(element);

              var unsubscribe = scope.$watch(attrs.ngModel, function (opts) {
                  if (opts) {
                      $timeout(function () {
                          $el.timepicker();
                          unsubscribe();
                      });
                  }
              })

          }
      };
  }).directive('disableOnClick', function ($parse) {
    return {
        restrict: 'A',
        compile: function ($element, attr) {
            var fn = $parse(attr.disableOnClick);
            return function clickHandler(scope, element, attrs) {
                element.on('click', function (event) {
                    attrs.$set('disabled', true);
                    angular.element($('#' + attr.loaderElement)).removeClass('ng-hide');
                    scope.$apply(function () {
                        fn(scope, { $event: event }).finally(function () {
                            attrs.$set('disabled', false);
                            angular.element($('#' + attr.loaderElement)).addClass('ng-hide');
                        });
                    });
                });
            };
        }
    };
});

