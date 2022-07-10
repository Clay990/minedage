// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);
        
        angular.element(document).ready(function () {
            if (window.cordova) {
                document.addEventListener('deviceready', function () {
                    
                    //angular.bootstrap(document.body, ['colorAdminApp']);
                }, false);
            } else {
                console.log("Running in browser, bootstrapping AngularJS now.");
                //angular.bootstrap(document.body, ['SchoolERPPortal']);
            }
        });
       
    };

    function onPause() {
    };

    function onResume() {
    };
} )();