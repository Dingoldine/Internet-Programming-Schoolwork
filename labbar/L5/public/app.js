(function(){
  var app = angular.module("stockmarket", [
  'ngRoute',
  'marketController',
  'ui.bootstrap'
  ]);

  app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/list', {
        templateUrl: 'list.html',
        controller: 'listController'
      }).
      when('/login', {
        templateUrl: 'login.html',
        controller: 'loginController'
      }).
      when('/about', {
        templateUrl: 'about.html',
        controller: 'aboutController'
      }).
      when('/security/:security', {
        templateUrl: 'security.html',
        controller: 'securityController'
      }).
      when('/buy', {
        templateUrl: 'buy.html',
        controller: 'buyController'
      }).
      when('/sell', {
        templateUrl: 'sell.html',
        controller: 'sellController'
      }).
      when('/addSecurity', {
        templateUrl: 'add.html',
        controller: 'addController'
      }).
      otherwise({
        redirectTo: '/list',
      });
  }]);

})();
