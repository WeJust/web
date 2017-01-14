angular.module('app', ['ngRoute']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/pages/login.html'
        })
        .when('/register',{
            templateUrl: '/pages/signup.html'
        })
        .when('/test', {
            templateUrl: '/pages/signup.html',
            controller: 'HomeController'
        });

}]);
