angular.module('app', ['ngRoute']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/pages/login.html',
        controller: 'HomeController'
      });
}]);
