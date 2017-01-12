angular.module('app', ['ngRoute']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/pages/login.html',
        controller: 'HomeController'
      })
      .when('/register', {
        templateUrl: '/pages/signup.html',
        controller: 'HomeController'
      });
}]);
