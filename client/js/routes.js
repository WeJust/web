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
        .when('/test', {
            templateUrl: '/pages/signup.html',
            controller: 'HomeController'
        });
}]);
