(function(){
  var app = angular.module("ellora", [
  'ngRoute',
  'ngCookies',
  'elloraController',
  'ui.bootstrap',
  'ui.router'
  ]);
  
  app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'home.html',
        controller: 'homeController'
      }).
      when('/meny', {
        templateUrl: 'meny.html',
        controller: 'menyController'
      }).
      when('/recentioner', {
        templateUrl: 'recentioner.html',
        controller: 'recentionerController'
      }).
      when('/about', {
        templateUrl: 'about.html',
        controller: 'aboutController'
      }).
      when('/login', {
        templateUrl: 'login.html',
        controller: 'loginController'
      }).
      when('/admin', {
        templateUrl: 'admin.html',
        controller: 'adminController'
      }).
      otherwise({
        redirectTo: '/home',
      });
  }]);

})();
