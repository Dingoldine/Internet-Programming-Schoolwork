"use strict";

var express = require('express');
var router = express.Router();
var model = require("./model.js");
var db = require("./dbmodel.js");

//A reservation request, makes insertion to database, sends the appropriate responsed based on if insertion successfull or not
router.post('/booking', function (req, res){
  console.log(req.body.time)

  db.addCustomer(req.body.name, req.body.email).then( function(customer) {

    console.log(customer)

    db.addReservation(req.body.name, req.body.numberOfPeople, req.body.time, req.body.email).then( function(reservation) {

      console.log(reservation);

      if(reservation.response == "error"){
        res.status(409).send({
          message: "Det finns tyvärr inga lediga bord på angiven tid"
        });
      }

      else{
        res.status(200).send({
          message: "Välkommen! Du har nu bokat ett bord " + reservation.arrival
        });
      }

    });
  });
});

//responds to view all reviews, fetches and sends back
router.get('/getReviews', function(req, res) {

  db.getReviews().then( function(result) {

       res.status(200).send({
          message: result
        });


  });

});

//responds to getReservations, fetches form db and sends back 
router.get('/getReservations', function(req, res) {

  db.getReservations().then( function(result) {

       res.status(200).send({
          message: result
        });


  });

});

//responds to getItems, fetches from db and sends back
router.get('/getItems', function(req, res) {

  db.getItems().then( function(result) {

       res.status(200).send({
          message: result
        });


  });

});

//responds to getItems, fetches from db and sends back
router.get('/getOrders', function(req, res) {

  db.getOrders().then( function(result) {
       var mess =  JSON.parse(JSON.stringify(result));
       res.status(200).send({
          message: mess
        });

  });

});

//responsds to add item post request. sends back http status code depending on result
router.post('/addItem', function(req, res) {

  db.addItem(req.body.name, req.body.description, req.body.price, req.body.type).then( function(result) {

      if(result.response == "error"){
        res.status(409).send({
        message: "Det finns redan en rätt med samma namn"
        });
      }
      else{
        res.status(200).send({
          message: result
        });

      }
  
  });
});

//add review, responds with http status code
router.post('/addReview', function(req, res) {

  db.addReview(req.body.name, req.body.email, req.body.stars, req.body.review).then( function(result) {
      
      res.status(200).send({
        message: result
      });
  });
});



router.post('/makeOrder', function(req, res) {

 db.addCustomer(req.body.name, req.body.email).then( function(customer) {

    console.log(customer)

    db.addOrder(req.body.name, req.body.email, req.body.amount, req.body.items).then( function(result) {
        
        res.status(200).send({
          message: "Välkommen! Din order är registrerad hos oss! "
        });
    });
  });
});

module.exports = router;
