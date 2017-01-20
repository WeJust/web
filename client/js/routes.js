var app = angular.module('app', ['ngRoute','firebase']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/pages/login.html'
        })
        .when('/register',{
            templateUrl: '/pages/signup.html',
            controller:'HomeController'
        })
        .when('/home',{
            templateUrl: '/pages/home.html',
            controller:'MainController'
        })
        .when('/error', {
            templateUrl: '/pages/error.html',
            controller: 'HomeController'
        })
        .when('/resetPassword', {
            templateUrl: '/pages/resetPassword.html'
        })
        .when('/create_room', {
            templateUrl: '/pages/create_room.html',
            controller: 'HomeController'
        })
        .when('/my_profile', {
            templateUrl: '/pages/profile.html',
            controller: 'HomeController'
        .when('/room', {
            templateUrl: '/pages/room.html',
            controller: 'RoomController'
        })
        .when('/join_room', {
            templateUrl: '/pages/join_room.html',
            controller: 'HomeController'
        });
}]);
