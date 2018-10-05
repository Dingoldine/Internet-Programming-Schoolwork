var marketController = angular.module('marketController', []);

//The controller of the view list.html
marketController.controller('listController', ['$scope', '$location',  'HttpService',
  function($scope, $location, http) {
    console.log("inListController");
    $scope.securities = [];

    http.get("/listSecurities", function(response) {
      console.log(response.list);
      $scope.securities = response.list;

    });

    $scope.redirect = function(security) {
      console.log("Trying to enter security : " + security);
      $location.hash("");
      $location.path('/security/' + security);
    };
  }
]);

//The controller of the view inside a security
marketController.controller('securityController', ['$scope', 'HttpService', '$routeParams','$location', 'UserService',
  function($scope, http, $routeParams,$location, user) {
    console.log("inSecurityController");
    $scope.security = $routeParams.security;
    $scope.trades = [];
    $scope.buys = [];
    $scope.sells = [];

    var socket = io().connect();


    http.post('getInfo', {name: $scope.security}, function(response) {
      var result = JSON.parse(JSON.stringify(response))
     // console.log(result);
      //console.log(result.buys);

      $scope.trades = response.trades;
      $scope.buys = result.buys;
      $scope.sells = response.sells;

      socket.emit("join", {name:$scope.security, username: user.getName()});
    });

    
    //when a new buy happens, we add it to scope
    socket.on('buyUpdate', function (data) {
      console.log("I RECIEVED A BUY UPDATE WOOHOO");

       $scope.$apply(function(){
            console.log(data);
            $scope.buys.push(data);
        });
    })

    //when a new sell happens, we add it to scope
    socket.on('sellUpdate', function (data) {

      console.log("I RECIEVED A SEll UPDATE WOOHOO");
      console.log(data);
      
        $scope.$apply(function(){
            console.log(data);
            $scope.sells.push(data);
        });

    });

    //when a new trade happens, we add it to scope
    socket.on('tradeUpdate', function (data) {
      console.log("I RECIEVED A TRADE UPDATE WOOHOO");

      $scope.$apply(function(){
        console.log(data);
        $scope.trades.push(data);
      });
    });

    //when a order terminates, because of a match with another order, we remove it from scope
    socket.on('destroyObject', function (id) {
      console.log("I RECIEVED Destroy instruction UPDATE WOOHOO");
      var found = false; 

      $scope.$apply(function(){
        console.log(id);
        
        for(var i = 0; i < $scope.sells.length; i++) {
          if($scope.sells[i].id === id) {
            found = true;
            $scope.sells.splice(i, 1);
          }
        }

        if(!found){
          for(var i = 0; i < $scope.buys.length; i++) {
            if($scope.buys[i].id === id) {
              $scope.buys.splice(i, 1);
            }
          }
        }
            
      });
    });

    $scope.$on('$routeChangeStart', function($event, next, current) { 
          
          socket.emit('leave', {name:$scope.security, username: user.getName()});
    });


   
    }
]);

//does nothing, about is just a static page
marketController.controller('aboutController', ['$scope',
  function($scope) {

  }
]);

//controller for login view
marketController.controller('loginController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
     console.log("inLoginController");
    $scope.username = "";
    $scope.done = function() {
  
      http.post('addUser', {username: $scope.username}, function(response) {
        console.log(response);
        user.setName($scope.username);

        //sends user to list page
        $location.path('list');
      });
    };

  }
]);

//controller for buy view
marketController.controller('buyController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    console.log("inBuyController");
    var username = user.getName();

    $scope.done = function() {

      if(username === ""){
        alert("login first");
      }
      else{
      console.log("Reached done()");
      var securityName = $scope.name;
      var amount = $scope.amount;
      var securityPrice = $scope.price;
      http.post('buy', {user: username, security: securityName, amount: amount, price: securityPrice}, function(response) {
        console.log("Response:")
        console.log(response.msg)
      });

      //sends user to list page
      $location.path('list');

    };
    }
  }
]);

//controller for sell view
marketController.controller('sellController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    console.log("inSellController");
    var username = user.getName();

    $scope.done = function() {
      if(username === ""){
        alert("login first");
      }
      else{
      var name = $scope.name;
      var amount = $scope.amount;
      var price = $scope.price;
      http.post('sell', {user: username, stock: name, amount: amount, price: price}, function(response) {
        console.log("Response:")
        console.log(response.msg)
      });

       //sends user to list page
     
      $location.path('list');
    };
    }

  }
]);

marketController.controller('addController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
      console.log("inAddController");
    $scope.name = "";
    //This fires twice?? WHY
    $scope.done = function() {

      var stockName = $scope.name;
      http.post('addSecurity', {stock: stockName}, function(response) {
        console.log("Response:")
        console.log(response.msg)

        //sends user to list page
         $location.path('list');
      });

      

    };
  }
]);

//controller for navigating between pages
marketController.controller('navigationController', ['$scope',  '$location',
  function($scope,  $location) {
    $scope.location = $location.path();

    // // This function should direct the user to the wanted page
    $scope.redirect = function(address) {
      $location.hash("");
      $location.path('/' + address);
      $scope.location = $location.path();
      console.log("location = " + $scope.location);
    };

  }
]);
