var elloraController = angular.module('elloraController', ['ui.bootstrap', 'ui.router']);



//State used for shifting state after login, and require login before accessing admin page
elloraController.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
       
    $stateProvider
      .state('login', {
          url : '/login',
          templateUrl : 'login.html',
          controller : 'LoginController'
        })
      .state('admin', {
        url : '/admin',
        templateUrl : 'admin.html',
        controller : 'adminController'
      });
  }]);

//does nothing, about is just a static page
elloraController.controller('aboutController', ['$scope',
  function($scope) {
    console.log("inAboutController");
  }
]);


//Shows the menu to the user, makes a http get request to the server
elloraController.controller('menyController', ['$scope', 'HttpService','$uibModal', '$log',
  function($scope, http, $uibModal, $log) {
    console.log("inMenyController"); 
    $scope.items = []
    $scope.cart = []
    $scope.total = 0;

    http.get('/getItems').then( 

        function successCallback(response) {
          console.log(response)
          $scope.items = response.data.message

        }, function errorCallback(response) {
            console.log("Something went wrong..")
      });

    $scope.addItemToCart = function(item){
      
      if ($scope.cart.length === 0){
        item.count = 1;
        $scope.cart.push(item);
      } 
      else {
        var repeat = false;
        for(var i = 0; i< $scope.cart.length; i++){
          if($scope.cart[i].id === item.id){
            repeat = true;
            $scope.cart[i].count +=1;
          }
        }
        if (!repeat) {
          item.count = 1;
          $scope.cart.push(item);  
        }
      }

      $scope.total += parseFloat(item.price);
    }

    $scope.removeItemCart = function(item){
       
       if(item.count > 1){
         item.count -= 1;
       }
       else if(item.count === 1){
        var index = $scope.cart.indexOf(item);
        $scope.cart.splice(index, 1);    
       }
       
       $scope.total -= parseFloat(item.price);
       
     };


     $scope.makeOrder = function(items){
      console.log("now i should make an order")

      var modalInstance = $uibModal.open({
            templateUrl: 'makeOrderModal.html',
            controller: makeOrderModalInstanceCtrl,
            scope: $scope,
            resolve: {
                orderForm: function () {
                    return $scope.orderForm;
                },
                total: function(){
                  return $scope.total;
                },
                cart: function(){
                  return $scope.cart;
                }
            }
        });

        //when modal is closed
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

  }
]);

var makeOrderModalInstanceCtrl = function ($scope, $uibModalInstance, HttpService, orderForm, total, cart) {
    $scope.form = {}
    $scope.cart = cart
    $scope.total = total

    $scope.submitForm = function () {

        if ($scope.form.orderForm.$valid) {
            var name = $scope.name;
            var email = $scope.email

            $uibModalInstance.close('closed');

            HttpService.post('/makeOrder', {name: name, email: email, amount: total, items: cart}).then( 

              function successCallback(response) {
                console.log(response)
                alert(response.data.message)
              }, function errorCallback(response) {
                console.log(response)
                alert(response.data.message)
              });

        } 
        else {
            console.log('orderForm is not in scope');
        }

    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


}
 //shows the admin page to a user that has logged in, uses Loginservice to see if user is authenticated, else transitions to login-page
 //makes a http get request to show all orders and bookings, can also post to add an item to the menu 
elloraController.controller('adminController', ['$scope', 'LoginService', '$state', 'HttpService', '$uibModal', '$log',
  function($scope, LoginService, $state, http, $uibModal, $log) {

    if(!LoginService.isAuthenticated()) {
      $state.transitionTo('login'); 
    }
    else{

      var socket = io().connect();
      
      $scope.bookings = []
      $scope.orders = []
      
      

     http.get("/getReservations").then( 

        function successCallback(response) {
          //console.log(response)
          $scope.bookings = response.data.message

        }, function errorCallback(response) {
            console.log("Something went wrong..")
      });


     http.get("/getOrders").then( 

        function successCallback(response) {

          $scope.orders = response.data.message;

          //just logging to understand, does nothing else
          var log = []; 
          angular.forEach( $scope.orders, function(value, key) {
            console.log("order headers")
            console.log(key)
            console.log(value)

            console.log("order body")
            angular.forEach(value.order, function(value, key) {
              console.log(key)
              console.log(value)
              //$scope.items.push(value)
            });

            this.push(key + ': ' + value);
          }, log);


          console.log(log)

        }, function errorCallback(response) {
            console.log("Something went wrong..")
      });


     //emit join, subscribe to room
     socket.emit('joinAdmin', {user: 'admin'})

      //on route change, emit leave
     $scope.$on('$routeChangeStart', function($event, next, current) { 
        socket.emit('leaveAdmin', {user: 'admin'});
     });
      

     //Toggle a modal if a button is pressed
    $scope.showForm = function () {
        $scope.message = "Show Form Button Clicked";
        console.log($scope.message);

        var modalInstance = $uibModal.open({
            templateUrl: 'addItemModal.html',
            controller: AddItemModalInstanceCtrl,
            scope: $scope,
            resolve: {
                addForm: function () {
                    return $scope.addForm;
                }
            }
        });

        //when model is closed
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    //when a new booking happens, this connection is updated via sockets
    socket.on('newBooking', function (data) {
      console.log("new booking happened");

       $scope.$apply(function(){
          console.log(data);
          $scope.bookings.push(data);
        });
    })

    socket.on('newOrder', function(data) {
      console.log("new order happened");

      $scope.$apply(function(){
        console.log(data)
       $scope.orders.push(data);
      });
      
    });

    }
  }
]);

//the modal for adding an item to the menu
var AddItemModalInstanceCtrl = function ($scope, $uibModalInstance, HttpService, addForm) {
    $scope.form = {}

    console.log("inModalController")

    $scope.submitForm = function () {

        if ($scope.form.addForm.$valid) {
            var name = $scope.name;
            var description = $scope.description;
            var price =  $scope.price;
            var type = $scope.type


            console.log(name);
            console.log(description);
            console.log(price);


            $uibModalInstance.close('closed');



            HttpService.post('/addItem', {name: name, description: description, price: price, type: type}).then( 

              function successCallback(response) {
                console.log(response)
                alert(response.data.message)
              }, function errorCallback(response) {
                console.log(response)
                alert(response.data.message)
              });

        } 
        else {
            console.log('addForm is not in scope');
        }

    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

};


//The modal to handle login, if correct password/username transition to admin page, else display error
elloraController.controller('loginController', ['$scope', '$location', 'LoginService', '$rootScope', '$stateParams', '$state',
  function($scope, $location, LoginService, $rootScope, $stateParams, $state) {
    
    if(LoginService.isAuthenticated()) {
      $state.transitionTo('admin'); 
    }
    else{
      console.log("inLoginController");
      $scope.login = function() {

        if(LoginService.login($scope.username, $scope.password)) {
          $scope.error = '';
          $scope.username = '';
          $scope.password = '';
          $state.transitionTo('admin');
        } else {
          $scope.error = "Incorrect username/password !";
        }   
      };
    }
  }
]);

//The controller for the view "recentioner", makes a get request to fetch all reviews in db, also has a form to add review,
//when submited correctly, makes a post request to the server
elloraController.controller('recentionerController', ['$scope', 'HttpService', '$location',
  function($scope, http, $location) {
     console.log("inRecentionerController");
     $scope.reviews = [];
     var socket = io().connect();

      http.get("/getReviews").then( 

        function successCallback(response) {
          console.log(response)
          $scope.reviews = response.data.message

        }, function errorCallback(response) {
            console.log("Something went wrong..")
      });

       //emit join, subscribe to room
     socket.emit('joinCommentSection', {user: 'anon'})

      //on route change, emit leave
     $scope.$on('$routeChangeStart', function($event, next, current) { 
        socket.emit('leaveCommentSection', {user: 'anon'});
     });

     socket.on('newReview', function (data) {
      console.log("new review happened");

       $scope.$apply(function(){
          console.log(data);
          $scope.reviews.push(data);
        });
    })
      


      $scope.submitForm = function() {
        if($scope.form.revForm.$valid){
          var name = $scope.name
          var email = $scope.email
          var review = $scope.review
          var stars = $scope.stars



          http.post("/addReview", {name: name, email: email, review: review, stars: stars}).then( 

          function successCallback(response) {
            console.log(response)
            //$scope.reviews.push(response.data.message)

          }, function errorCallback(response) {

          });          
        }
        else{
          console.log("form is invalid")
        }

      }


  }
]);

//Controller for home-page, fetches reviews, angular html displays the 4 most recent ones, opens up a modal when a button is clicked
elloraController.controller("homeController", ['$scope', '$uibModal', '$log', 'HttpService',

    function ($scope, $uibModal, $log, http) {
        console.log("in homeController")
        $scope.quantity = 4;
        $scope.reviews = [];
        $scope.orderprop = 'date';

        http.get("/getReviews").then( 

        function successCallback(response) {
          console.log(response)
          $scope.reviews = response.data.message

        }, function errorCallback(response) {
            console.log("Something went wrong..")
        });


        //modal opens
        $scope.showForm = function () {
            $scope.message = "Show Form Button Clicked";
            console.log($scope.message);

            var modalInstance = $uibModal.open({
                templateUrl: 'bookModal.html',
                controller: BookModalInstanceCtrl,
                scope: $scope,
                resolve: {
                    userForm: function () {
                        return $scope.userForm;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

            }]);

//modal for making  a reservation
var BookModalInstanceCtrl = function ($scope, $uibModalInstance, HttpService, userForm) {
    $scope.form = {}

    console.log("inModalController")
    
    var dummyDate = parseISOLocal("2017-06-01T08:30");
    console.log(dummyDate.getHours());
    var dummyData = {name: "Philip", email: "example@hotmail.com", numberOfPeople: "8", time: dummyDate.toISOString()}

    $scope.submitForm = function () {

        if ($scope.form.userForm.$valid) {
            var name = $scope.name;
            var email = $scope.email;
            var numberOfPeople =  $scope.numberPpl;
            var time =  $scope.time;

            console.log(name);
            console.log(email);
            console.log(numberOfPeople);
            console.log(time);

            $uibModalInstance.close('closed');

            HttpService.post('booking', {name: name, email: email, numberOfPeople: numberOfPeople, time: time}).then( 

              function successCallback(response) {
                console.log(response)
                alert(response.data.message)
              }, function errorCallback(response) {
                console.log(response)
                alert(response.data.message)
              });

        } else {
            console.log('userform is not in scope');
        }

    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

  //this was used for time convertion and parsing during testing, is not used more now though.. 
  function parseISOLocal(s) {
    var b = s.split(/\D/);
    return new Date(b[0], b[1]-1, b[2], b[3], b[4]);
  }

};

//controller for navigating between pages NAV BAR
elloraController.controller('navigationController', ['$scope',  '$location',
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