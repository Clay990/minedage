/*
Template Name: Color Admin - Responsive Admin Dashboard Template build with Twitter Bootstrap 3.3.7 & Bootstrap 4.0.0-Alpha 6
Version: 3.0.0
Author: Sean Ngu
Website: http://www.seantheme.com/color-admin-v3.0/admin/angularjs/
*/

var colorAdminApp = angular.module('colorAdminApp', [
    'ui.router',
    'ui.bootstrap',
    'oc.lazyLoad',
    'datatables', 'datatables.bootstrap',
    'thatisuday.dropzone',
    'ngTagsInput'
]);

colorAdminApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/member/branch');

    $stateProvider
        .state('app', {
            url: '/app',
            templateUrl: 'template/app.html',
            abstract: true
        })

    .state('error', {
        url: '/error',
        data: { pageTitle: '404 Error' },
        templateUrl: 'views/extra_404_error.html'
    })

    .state('member', {
            url: '/member',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('member.login', {
            url: '/login',
            params: {
                redirectUrl: null
            },
            data: { pageTitle: 'Login' },
            templateUrl: 'views/login.html',
        })
        .state('member.phonenumber', {
            url: '/phonenumber',
            params: {
                redirectUrl: null
            },
            data: { pageTitle: 'Phone' },
            templateUrl: 'views/phoneNumber.html',
        })
        .state('member.branch', {
            url: '/branch',
            params: {
                redirectUrl: null
            },
            data: { pageTitle: 'Branch' },
            templateUrl: 'views/branch.html',
        })
        .state('app.changePassword', {
            url: '/change-password',
            data: { pageTitle: 'Change Password' },
            templateUrl: 'views/changePassword.html',

        })

    .state('app.student', {
        url: '/student',
        template: '<div ui-view></div>',
        abstract: true
    })

    .state('app.student.dashboard', {
        url: '/dashboard',
        templateUrl: 'views/admin/dashboard.html',
        data: { pageTitle: 'Dashboard' }
    })

    .state('app.student.screen', {
        url: '/screen',
        templateUrl: 'views/teacher/screen.html',
        data: { pageTitle: 'Screen' }
    })

    .state('app.student.notice', {
            url: '/notice',
            data: { pageTitle: 'Notice' },
            templateUrl: 'views/student/notice.html',

        })
        .state('app.student.notice.sendNotice', {
            url: '/send-notice',
            data: { pageTitle: 'Notice' },
            templateUrl: 'views/admin/notice/sendNotice.html',

        })
        .state('app.student.notice.viewNotice', {
            url: '/notice-report',
            data: { pageTitle: 'Notice Report' },
            templateUrl: 'views/admin/notice/noticeReport.html',

        })
        .state('app.student.account', {
            url: '/account',
            data: { pageTitle: 'Account' },
            templateUrl: 'views/admin/account.html',

        })
        .state('app.student.classCalendar', {
            url: '/class-calendar',
            data: { pageTitle: 'Class Calendar' },
            templateUrl: 'views/student/classCalendar.html',

        })

    .state('app.student.assignment', {
        url: '/assignment',
        data: { pageTitle: 'Assignments' },
        templateUrl: 'views/admin/assignment.html',

    })

    .state('app.student.elearningMaterial', {
        url: '/elearning',
        data: { pageTitle: 'Elearning' },
        templateUrl: 'views/student/elearningMaterial.html',

    })



    .state('app.student.downloads', {
        url: '/myfiles',
        data: { pageTitle: 'Downloads' },
        templateUrl: 'views/student/downloads.html',

    })

    .state('app.student.smartClass', {
        url: '/smart-class',
        data: { pageTitle: 'Smart Class' },
        templateUrl: 'views/admin/smartClass.html',

    })

    .state('app.student.onlineQuiz', {
            url: '/online-quiz',
            data: { pageTitle: 'Online Quiz' },
            templateUrl: 'views/student/onlineQuiz.html',

        })
        .state('app.student.onlineExam', {
            url: '/online-exam',
            template: '<div ui-view></div>',
            abstract: true

        })
        .state('app.student.onlineExam.viewOnlineExam', {
            url: '/online-exam',
            data: { pageTitle: 'Online Exam' },
            templateUrl: 'views/student/onlineexam/onlineExam.html',

        })
        .state('app.student.onlineExam.viewOnlineExamResult', {
            url: '/view-result',
            data: { pageTitle: 'Online Exam Result' },
            templateUrl: 'views/student/onlineexam/viewOnlineExamResult.html',

        })

    .state('app.student.onlineExam.viewOnlineExamWorkFlowDocument', {
            url: '/student-onlineExam-document/:onlineExamId/:onlineExamTypeId/:studentId/:onlineExamResultId',
            data: { pageTitle: 'Online Exam Documents' },
            templateUrl: 'views/student/onlineexam/viewOnlineExamWorkFlowDocument.html',

        })
        .state('app.student.alert', {
            url: '/alert',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.student.alert.alertReport', {
            url: '/alert-report',
            data: { pageTitle: 'Alert Report' },
            templateUrl: 'views/student/alert/alertReport.html',

        })

    .state('app.student.attendance', {
            url: '/attendance',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.student.attendance.alertReport', {
            url: '/alert-report',
            data: { pageTitle: 'Attendance Alert Report' },
            templateUrl: 'views/student/attendance/attendanceAlertReport.html',

        })
        .state('app.student.attendance.holidayCalendar', {
            url: '/holiday-calendar',
            data: { pageTitle: 'Holiday Calendar' },
            templateUrl: 'views/student/attendance/holidayCalendar.html',

        })
        .state('app.student.attendance.attendanceInOut', {
            url: '/in-out-report',
            data: { pageTitle: 'Attendance In Out Report' },
            templateUrl: 'views/student/attendance/attendanceInOutReport.html',

        })
        .state('app.student.attendance.attendanceReport', {
            url: '/attendance-report',
            data: { pageTitle: 'Attendancet Report' },
            templateUrl: 'views/student/attendance/attendanceReport.html',

        })
        .state('app.student.attendance.absentReport', {
            url: '/absent-report',
            data: { pageTitle: 'Absent Report' },
            templateUrl: 'views/student/attendance/absentReport.html',

        })
        .state('app.student.attendance.monthlyReport', {
            url: '/monthly-report',
            data: { pageTitle: 'Attendance Monthly Report' },
            templateUrl: 'views/student/attendance/attendanceMonthlyReport.html',
            resolve: {
                service: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        serie: true,
                        files: [
                            'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.2/d3.min.js',
                            'assets/plugins/bootstrap-calendar/css/bootstrap_calendar.css',
                            'assets/plugins/bootstrap-calendar/js/bootstrap_calendar.js',
                        ]
                    });
                }]
            }
        })


    .state('app.student.fee', {
            url: '/fee',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.student.fee.feeDetail', {
            url: '/payment-detail',
            data: { pageTitle: 'Fee Detail' },
            templateUrl: 'views/student/fee/feeDetail.html',

        })

    .state('app.student.fee.feeStructure', {
        url: '/fee-structure',
        data: { pageTitle: 'Fee Structure' },
        templateUrl: 'views/student/fee/feeStructure.html',

    })

    .state('app.student.fee.feePayment', {
        url: '/fee-payment',
        data: { pageTitle: 'Fee Payment' },
        templateUrl: 'views/student/fee/feePayment.html',

    })


    .state('app.student.profile', {
        url: '/profile',
        data: { pageTitle: 'Profile' },
        templateUrl: 'views/student/profile.html',
        resolve: {
            service: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    files: [
                        'assets/plugins/superbox/css/superbox.min.css',
                        'assets/plugins/lity/dist/lity.min.css',
                        'assets/plugins/superbox/js/jquery.superbox.min.js',
                        'assets/plugins/lity/dist/lity.min.js',
                    ]
                })
            }]
        }
    })


    .state('app.student.helpRequest', {
        url: '/help-request',
        data: { pageTitle: 'Help Request' },
        templateUrl: 'views/student/help/helpRequest.html',

    })

    .state('app.student.setting', {
        url: '/setting',
        data: { pageTitle: 'Setting' },
        templateUrl: 'views/student/setting/setting.html',

    })

    .state('app.student.examination', {
            url: '/examination',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.student.examination.assessmentResult', {
            url: '/assessment-result',
            data: { pageTitle: 'Assessment Result' },
            templateUrl: 'views/student/examination/assessmentResult.html',

            params: {
                assessment: 1
            },
        })
        .state('app.student.examination.finalResult', {
            url: '/final-result',
            data: { pageTitle: 'Final Result' },
            templateUrl: 'views/student/examination/finalResult.html'
        })

    .state('app.student.saveAssignmentWork', {
        url: '/student-assignment-work/:assignmentId/:assignmentTypeId',
        data: { pageTitle: 'Assignment Work' },
        templateUrl: 'views/student/assignmentWork.html',

    })

    .state('app.student.saveOnlineExamWork', {
        url: '/student-online-exam-work/:onlineExamId/:onlineExamTypeId',
        data: { pageTitle: 'Online Exam Work' },
        templateUrl: 'views/student/onlineexam/onlineExamWork.html',

    })

    .state('app.student.saveAssignmentWorkFlow', {
        url: '/student-assignment-workflow/:assignmentId/:assignmentTypeId',
        data: { pageTitle: 'Assignment Work Flow' },
        templateUrl: 'views/student/assignmentWorkFlow.html',

    })


    .state('app.alertuser', {
        url: '/alertuser',
        template: '<div ui-view></div>',
        abstract: true
    })


    .state('app.alertuser.helpRequest', {
        url: '/help-request',
        data: { pageTitle: 'Help Request' },
        templateUrl: 'views/alertuser/help/helpRequest.html',

    })

    .state('app.alertuser.dashboard', {
        url: '/dashboard',
        data: { pageTitle: 'Dashboard' },
        templateUrl: 'views/alertuser/dashboard.html',

    })

    .state('app.alertuser.screen', {
        url: '/screen',
        templateUrl: 'views/alertuser/screen.html',
        data: { pageTitle: 'Screen' }
    })

    .state('app.alertuser.profile', {
        url: '/profile',
        data: { pageTitle: 'Profile' },
        templateUrl: 'views/alertuser/profile.html',
        resolve: {
            service: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    files: [
                        'assets/plugins/superbox/css/superbox.min.css',
                        'assets/plugins/lity/dist/lity.min.css',
                        'assets/plugins/superbox/js/jquery.superbox.min.js',
                        'assets/plugins/lity/dist/lity.min.js',
                    ]
                })
            }]
        }
    })





    .state('app.alertuser.alert', {
            url: '/alert',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.alertuser.alert.alertReport', {
            url: '/alert-report',
            data: { pageTitle: 'Alert Report' },
            templateUrl: 'views/alertuser/alert/alertReport.html',

        })

    .state('app.teacher', {
        url: '/teacher',
        template: '<div ui-view></div>',
        abstract: true
    })


    .state('app.teacher.dashboard', {
        url: '/dashboard',
        templateUrl: 'views/teacher/dashboard.html',
        data: { pageTitle: 'Dashboard' }
    })



    .state('app.teacher.screen', {
        url: '/screen',
        templateUrl: 'views/teacher/screen.html',
        data: { pageTitle: 'Screen' }
    })


    .state('app.teacher.notice', {
            url: '/notice',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.teacher.notice.sendNotice', {
            url: '/send-notice',
            data: { pageTitle: 'Notice' },
            templateUrl: 'views/teacher/notice/sendNotice.html',

        })
        .state('app.teacher.notice.viewNotice', {
            url: '/notice-report',
            data: { pageTitle: 'Notice Report' },
            templateUrl: 'views/teacher/notice/noticeReport.html',

        })

    .state('app.teacher.smartClass', {
        url: '/smart-class',
        data: { pageTitle: 'Smart Class' },
        templateUrl: 'views/teacher/smartClass.html',

    })


    .state('app.teacher.markAttendance', {
        url: '/markAttendance',
        data: { pageTitle: 'Mark Attendance' },
        templateUrl: 'views/teacher/markAttendance.html',

    })

    .state('app.teacher.sendAbsentAlert', {
        url: '/sendAbsentAlert',
        data: { pageTitle: 'Send Absent Alert' },
        templateUrl: 'views/teacher/sendAbsentAlert.html',

    })

    .state('app.teacher.attendance.studentList', {
        url: '/studentList',
        data: { pageTitle: 'Student List' },
        templateUrl: 'views/teacher/attendance/studentList.html',

    })

    .state('app.teacher.attendance.viewStudentDetail', {
        url: '/student-detail/:studentId',
        data: { pageTitle: 'Student Detail' },
        templateUrl: 'views/teacher/attendance/studentDetail.html',

    })

    .state('app.teacher.classCalendar', {
        url: '/class-calendar',
        data: { pageTitle: 'Time Table' },
        templateUrl: 'views/teacher/classCalendar.html',

    })

    .state('app.teacher.assignment', {
        url: '/assignment',
        template: '<div ui-view></div>',
        abstract: true

    })

    .state('app.teacher.assignment.uploadAssignment', {
        url: '/upload',
        data: { pageTitle: 'Upload Assignment' },
        templateUrl: 'views/teacher/assignment/uploadAssignment.html',

    })

    .state('app.teacher.assignment.viewAssignmentWorkFlow', {
        url: '/teacher-assignment-workflow/:assignmentId/:assignmentTypeId',
        data: { pageTitle: 'Assignment Work Flow' },
        templateUrl: 'views/teacher/assignment/assignmentWorkFlow.html',

    })

    .state('app.teacher.assignment.viewAssignmentWork', {
        url: '/teacher-assignment-work/:assignmentId/:assignmentTypeId',
        data: { pageTitle: 'Assignment Work' },
        templateUrl: 'views/teacher/assignment/viewAssignmentWork.html',

    })



    .state('app.teacher.assignment.viewAssignment', {
            url: '/view',
            data: { pageTitle: 'View Assignment' },
            templateUrl: 'views/teacher/assignment/viewAssignment.html',

        })
        .state('app.teacher.elearning', {
            url: '/elearning',
            template: '<div ui-view></div>',
            abstract: true

        })

    .state('app.teacher.elearning.elearningMaterial', {
        url: '/elearning',
        data: { pageTitle: 'Elearning' },
        templateUrl: 'views/teacher/elearning/elearningMaterial.html',

    })

    .state('app.teacher.onlineExam', {
        url: '/onlineExams',
        template: '<div ui-view></div>',
        abstract: true

    })

    .state('app.teacher.onlineExam.uploadOnlineExam', {
        url: '/upload',
        data: { pageTitle: 'Upload Online Exam' },
        templateUrl: 'views/teacher/onlineexam/uploadOnlineExam.html',

    })


    .state('app.teacher.onlineExam.viewOnlineExamWork', {
        url: '/teacher-onlineExam-work/:onlineExamId/:onlineExamTypeId/:studentId',
        data: { pageTitle: 'Online Exam Work' },
        templateUrl: 'views/teacher/onlineexam/viewOnlineExamWork.html',

    })


    .state('app.teacher.onlineExam.viewOnlineExam', {
        url: '/view-online-exam',
        data: { pageTitle: 'Online Exam' },
        templateUrl: 'views/teacher/onlineexam/viewOnlineExam.html',

    })

    .state('app.teacher.onlineExam.viewOnlineExamStudent', {
            url: '/teacher-onlineExam-student/:onlineExamId/:onlineExamTypeId',
            data: { pageTitle: 'Online Exam Student' },
            templateUrl: 'views/teacher/onlineexam/onlineExamStudent.html',

        })
        .state('app.teacher.onlineExam.onlineExamWorkResult', {
            url: '/teacher-onlineExam-result/:onlineExamId/:onlineExamTypeId/:studentId/:classId',
            data: { pageTitle: 'Online Exam Result' },
            templateUrl: 'views/teacher/onlineexam/onlineExamWorkResult.html',

        })
        .state('app.teacher.onlineExam.viewOnlineExamResult', {
            url: '/view-result',
            data: { pageTitle: 'Online Exam Result' },
            templateUrl: 'views/teacher/onlineexam/viewOnlineExamResult.html',

        })

    .state('app.teacher.onlineExam.viewOnlineExamWorkFlowDocument', {
        url: '/teacher-onlineExam-document/:onlineExamId/:onlineExamTypeId/:studentId/:onlineExamResultId',
        data: { pageTitle: 'Online Exam Documents' },
        templateUrl: 'views/teacher/onlineexam/viewOnlineExamWorkFlowDocument.html',

    })


    .state('app.teacher.alert', {
        url: '/alert',
        template: '<div ui-view></div>',
        abstract: true
    })

    .state('app.teacher.alert.alertReport', {
        url: '/alert-report',
        data: { pageTitle: 'Alert Report' },
        templateUrl: 'views/teacher/alert/alertReport.html',

    })

    .state('app.teacher.alert.appAlertReport', {
            url: '/app-alert-report',
            data: { pageTitle: 'App Alert Report' },
            templateUrl: 'views/teacher/alert/appAlertReport.html',

        })
        .state('app.teacher.alert.sendAppAlert', {
            url: '/send-app-alert',
            data: { pageTitle: 'App Alert' },
            templateUrl: 'views/teacher/alert/sendAppAlert.html',

        })

    .state('app.teacher.attendance', {
        url: '/attendance',
        template: '<div ui-view></div>',
        abstract: true
    })

    .state('app.teacher.attendance.alertReport', {
        url: '/alert-report',
        data: { pageTitle: 'Attendance Alert Report' },
        templateUrl: 'views/teacher/attendance/attendanceAlertReport.html',

    })

    .state('app.teacher.attendance.holidayCalendar', {
        url: '/holiday-calendar',
        data: { pageTitle: 'Holiday Calendar' },
        templateUrl: 'views/teacher/attendance/holidayCalendar.html',

    })

    .state('app.teacher.attendance.attendanceInOut', {
        url: '/in-out-report',
        data: { pageTitle: 'Attendance In Out Report' },
        templateUrl: 'views/teacher/attendance/attendanceInOutReport.html',

    })

    .state('app.teacher.attendance.attendanceInOutDiscrepancy', {
        url: '/in-out-discrepancy-report',
        data: { pageTitle: 'In Out Discrepancy Report' },
        templateUrl: 'views/teacher/attendance/attendanceInOutDiscrepancyReport.html',

    })

    .state('app.teacher.attendance.attendanceReport', {
        url: '/attendance-report',
        data: { pageTitle: 'Attendancet Report' },
        templateUrl: 'views/teacher/attendance/attendanceReport.html',

    })

    .state('app.teacher.attendance.absentReport', {
        url: '/absent-report',
        data: { pageTitle: 'Absent Report' },
        templateUrl: 'views/teacher/attendance/absentReport.html',

    })

    .state('app.teacher.attendance.monthlyReport', {
        url: '/monthly-report',
        data: { pageTitle: 'Attendance Monthly Report' },
        templateUrl: 'views/teacher/attendance/attendanceMonthlyReport.html',
        resolve: {
            service: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    serie: true,
                    files: [
                        'assets/plugins/bootstrap-calendar/css/bootstrap_calendar.css',
                        'assets/plugins/bootstrap-calendar/js/bootstrap_calendar.js',
                    ]
                });
            }]
        }
    })

    .state('app.teacher.attendance.studentAttendanceMonthlyReport', {
        url: '/student-attendance-monthly-report/:studentId',
        data: { pageTitle: 'Attendance Monthly Report' },
        templateUrl: 'views/teacher/attendance/studentAttendanceMonthlyReport.html',
        resolve: {
            service: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    serie: true,
                    files: [
                        'assets/plugins/bootstrap-calendar/css/bootstrap_calendar.css',
                        'assets/plugins/bootstrap-calendar/js/bootstrap_calendar.js',
                    ]
                });
            }]
        }
    })


    .state('app.teacher.profile', {
        url: '/profile',
        data: { pageTitle: 'Profile' },
        templateUrl: 'views/teacher/profile.html',
        resolve: {
            service: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    files: [
                        'assets/plugins/superbox/css/superbox.min.css',
                        'assets/plugins/lity/dist/lity.min.css',
                        'assets/plugins/superbox/js/jquery.superbox.min.js',
                        'assets/plugins/lity/dist/lity.min.js',
                    ]
                })
            }]
        }
    })



    .state('app.teacher.helpRequest', {
        url: '/help-request',
        data: { pageTitle: 'Help Request' },
        templateUrl: 'views/teacher/help/helpRequest.html',

    })

    .state('app.teacher.setting', {
            url: '/setting',
            data: { pageTitle: 'Setting' },
            templateUrl: 'views/teacher/setting/setting.html',


        })
        .state('app.teacher.onlineQuiz', {
            url: '/online-quiz',
            data: { pageTitle: 'Online Quiz' },
            templateUrl: 'views/teacher/scheduleOnlineQuiz.html',

        })

    .state('app.admin', {
        url: '/admin',
        template: '<div ui-view></div>',
        abstract: true
    })

    .state('app.admin.dashboard', {
        url: '/dashboard',
        templateUrl: 'views/admin/dashboard.html',
        data: { pageTitle: 'Dashboard' }
    })

    .state('app.admin.screen', {
            url: '/screen',
            templateUrl: 'views/admin/screen.html',
            data: { pageTitle: 'Screen' }
        })
        .state('app.admin.elearning', {
            url: '/elearning',
            template: '<div ui-view></div>',
            abstract: true

        })

    .state('app.admin.elearning.elearningMaterial', {
            url: '/elearning',
            data: { pageTitle: 'Elearning' },
            templateUrl: 'views/admin/elearning/elearningMaterial.html',

        })
        .state('app.admin.classCalendar', {
            url: '/class-calendar',
            data: { pageTitle: 'Time Table' },
            templateUrl: 'views/admin/classCalendar.html',

        })
        .state('app.admin.notice', {
            url: '/notice',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.admin.notice.sendNotice', {
            url: '/send-notice',
            data: { pageTitle: 'Notice' },
            templateUrl: 'views/admin/notice/sendNotice.html',

        })
        .state('app.admin.notice.viewNotice', {
            url: '/notice-report',
            data: { pageTitle: 'Notice Report' },
            templateUrl: 'views/admin/notice/noticeReport.html',

        })
        .state('app.admin.timeTable', {
            url: '/time-table',
            data: { pageTitle: 'Time Table' },
            templateUrl: 'views/admin/timeTable.html',

        })

    .state('app.admin.assignment', {
        url: '/assignment',
        template: '<div ui-view></div>',
        abstract: true

    })

    .state('app.admin.assignment.uploadAssignment', {
        url: '/upload',
        data: { pageTitle: 'Upload Assignment' },
        templateUrl: 'views/admin/assignment/uploadAssignment.html',

    })

    .state('app.admin.assignment.viewAssignment', {
            url: '/view',
            data: { pageTitle: 'View Assignment' },
            templateUrl: 'views/admin/assignment/viewAssignment.html',

        })
        .state('app.admin.assignment.viewAssignmentWorkFlow', {
            url: '/admin-assignment-workflow/:assignmentId/:assignmentTypeId',
            data: { pageTitle: 'Assignment Work Flow' },
            templateUrl: 'views/admin/assignment/viewAssignmentWorkFlow.html',

        })

    .state('app.admin.assignment.viewAssignmentWork', {
        url: '/admin-assignment-work/:assignmentId/:assignmentTypeId',
        data: { pageTitle: 'Assignment Work' },
        templateUrl: 'views/admin/assignment/viewAssignmentWork.html',

    })


    .state('app.admin.onlineExam', {
        url: '/online-exam',
        template: '<div ui-view></div>',
        abstract: true

    })

    .state('app.admin.onlineExam.uploadOnlineExam', {
        url: '/exam-upload',
        data: { pageTitle: 'Upload Online Exam' },
        templateUrl: 'views/admin/onlineexam/uploadOnlineExam.html',

    })


    .state('app.admin.onlineExam.viewOnlineExamWork', {
        url: '/admin-onlineExam-work/:onlineExamId/:onlineExamTypeId/:studentId',
        data: { pageTitle: 'Online Exam Work' },
        templateUrl: 'views/admin/onlineexam/viewOnlineExamWork.html',

    })


    .state('app.admin.onlineExam.viewOnlineExam', {
        url: '/view',
        data: { pageTitle: 'Online Exam' },
        templateUrl: 'views/admin/onlineexam/viewOnlineExam.html',

    })

    .state('app.admin.onlineExam.viewOnlineExamStudent', {
        url: '/admin-onlineExam-student/:onlineExamId/:onlineExamTypeId',
        data: { pageTitle: 'Online Exam Student' },
        templateUrl: 'views/admin/onlineexam/onlineExamStudent.html',

    })

    .state('app.admin.onlineExam.viewOnlineExamResult', {
            url: '/view-result',
            data: { pageTitle: 'Online Exam Result' },
            templateUrl: 'views/admin/onlineexam/viewOnlineExamResult.html',

        })
        .state('app.admin.onlineExam.onlineExamWorkResult', {
            url: '/admin-onlineExam-result/:onlineExamId/:onlineExamTypeId/:studentId/:classId/:studentName',
            data: { pageTitle: 'Online Exam Result' },
            templateUrl: 'views/admin/onlineexam/onlineExamWorkResult.html',

        })
        .state('app.admin.onlineExam.viewOnlineExamWorkFlowDocument', {
            url: '/admin-onlineExam-document/:onlineExamId/:onlineExamTypeId/:studentId/:onlineExamResultId',
            data: { pageTitle: 'Online Exam Documents' },
            templateUrl: 'views/admin/onlineexam/viewOnlineExamWorkFlowDocument.html',

        })


    .state('app.admin.alert', {
            url: '/alert',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.admin.alert.alertReport', {
            url: '/alert-report',
            data: { pageTitle: 'Alert Report' },
            templateUrl: 'views/admin/alert/alertReport.html',

        })


    .state('app.admin.alert.sendAppAlert', {
        url: '/send-app-alert/:alertTypeId',
        data: { pageTitle: 'App Alert' },
        templateUrl: 'views/admin/alert/sendAppAlert.html',

    })

    .state('app.admin.alert.sendSmsAlert', {
        url: '/send-sms-alert/:alertTypeId',
        data: { pageTitle: 'SMS Alert' },
        templateUrl: 'views/admin/alert/sendSmsAlert.html',

    })

    .state('app.admin.attendance.studentList', {
            url: '/studentList',
            data: { pageTitle: 'Student List' },
            templateUrl: 'views/admin/attendance/studentList.html',

        })
        .state('app.admin.attendance.viewStudentDetail', {
            url: '/student-detail/:studentId',
            data: { pageTitle: 'Student Detail' },
            templateUrl: 'views/admin/attendance/studentDetail.html',

        })
        .state('app.admin.attendance.employeeList', {
            url: '/employeeList',
            data: { pageTitle: 'Employee List' },
            templateUrl: 'views/admin/attendance/employeeList.html',

        })

    .state('app.admin.attendance.viewEmployeeDetail', {
        url: '/employee-detail/:employeeId',
        data: { pageTitle: 'Employee Detail' },
        templateUrl: 'views/admin/attendance/employeeDetail.html',

    })

    .state('app.admin.attendance.machineList', {
        url: '/machineList',
        data: { pageTitle: 'Machine List' },
        templateUrl: 'views/admin/attendance/machineList.html',

    })

    .state('app.admin.attendance.viewMachineDetail', {
        url: '/machine-detail/:machineMasterId',
        data: { pageTitle: 'Machine Detail' },
        templateUrl: 'views/admin/attendance/machineDetail.html',

    })

    .state('app.admin.markAttendance', {
            url: '/markAttendance',
            data: { pageTitle: 'Mark Attendance' },
            templateUrl: 'views/admin/markAttendance.html',

        })
        .state('app.admin.attendance', {
            url: '/attendance',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.admin.attendance.alertReport', {
            url: '/alert-report',
            data: { pageTitle: 'Attendance Alert Report' },
            templateUrl: 'views/admin/attendance/attendanceAlertReport.html',

        })
        .state('app.admin.attendance.holidayCalendar', {
            url: '/holiday-calendar',
            data: { pageTitle: 'Holiday Calendar' },
            templateUrl: 'views/admin/attendance/holidayCalendar.html',

        })
        .state('app.admin.attendance.attendanceInOut', {
            url: '/in-out-report',
            data: { pageTitle: 'Attendance In Out Report' },
            templateUrl: 'views/admin/attendance/attendanceInOutReport.html',

        })

    .state('app.admin.attendance.attendanceInOutDiscrepancy', {
        url: '/in-out-discrepancy-report',
        data: { pageTitle: 'In Out Discrepancy Report' },
        templateUrl: 'views/admin/attendance/attendanceInOutDiscrepancyReport.html',

    })


    .state('app.admin.attendance.attendanceReport', {
            url: '/attendance-report',
            data: { pageTitle: 'Attendancet Report' },
            templateUrl: 'views/admin/attendance/attendanceReport.html',

        })
        .state('app.admin.attendance.absentReport', {
            url: '/absent-report',
            data: { pageTitle: 'Absent Report' },
            templateUrl: 'views/admin/attendance/absentReport.html',

        })
        .state('app.admin.attendance.monthlyReport', {
            url: '/monthly-report',
            data: { pageTitle: 'Attendance Monthly Report' },
            templateUrl: 'views/admin/attendance/attendanceMonthlyReport.html',
            resolve: {
                service: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        serie: true,
                        files: [
                            'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.2/d3.min.js',
                            'assets/plugins/bootstrap-calendar/css/bootstrap_calendar.css',
                            'assets/plugins/bootstrap-calendar/js/bootstrap_calendar.js',
                        ]
                    });
                }]
            }
        })


    .state('app.admin.attendance.userAttendanceMonthlyReport', {
        url: '/student-attendance-monthly-report?entityId&roleId',
        data: { pageTitle: 'Attendance Monthly Report' },
        templateUrl: 'views/admin/attendance/userAttendanceMonthlyReport.html',
        resolve: {
            service: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    serie: true,
                    files: [
                        'assets/plugins/bootstrap-calendar/css/bootstrap_calendar.css',
                        'assets/plugins/bootstrap-calendar/js/bootstrap_calendar.js',
                    ]
                });
            }]
        }
    })


    .state('app.admin.smartClass', {
            url: '/smart-class',
            data: { pageTitle: 'Smart Class' },
            templateUrl: 'views/admin/smartClass.html',

        })
        .state('app.admin.fee', {
            url: '/fee',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.admin.fee.feePaymentSummary', {
            url: '/fee',
            data: { pageTitle: 'Payment Summary' },
            templateUrl: 'views/admin/fee/feepaymentsummary.html',

        })


    .state('app.admin.profile', {
        url: '/profile',
        data: { pageTitle: 'Profile' },
        templateUrl: 'views/admin/profile.html',
        resolve: {
            service: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    files: [
                        'assets/plugins/superbox/css/superbox.min.css',
                        'assets/plugins/lity/dist/lity.min.css',
                        'assets/plugins/superbox/js/jquery.superbox.min.js',
                        'assets/plugins/lity/dist/lity.min.js',
                    ]
                })
            }]
        }
    })


    .state('app.admin.helpRequest', {
        url: '/help-request',
        data: { pageTitle: 'Help Request' },
        templateUrl: 'views/admin/help/helpRequest.html',

    })

    $httpProvider.interceptors.push('spinnerInterceptor');


}]);

colorAdminApp.run(['$rootScope', '$state', 'setting', function($rootScope, $state, setting) {
    $rootScope.$state = $state;
    $rootScope.setting = setting;
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        $rootScope.previousParms = fromParams;
        $rootScope.previousState = fromState.name;
    });
}]);
colorAdminApp.factory('spinnerInterceptor', function() {
    return {
        request: function(config) {
            $('#spinner').show();
            return config;
        },
        response: function(config) {
            $('#spinner').hide();
            return config;
        },
        responseError: function(config) {
            $('#spinner').hide();
            return config;
        }
    };
})
