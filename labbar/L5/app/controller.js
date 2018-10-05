/* jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();
var model = require("./model.js");
var db = require("./dbmodel.js");

//Responds to the call to view all securities 
router.get('/listSecurities', function (req, res) {
  db.getSecurities().then(function(result){
    var data = JSON.parse(JSON.stringify(result));

    var securityNames = [];

    for (var i = 0; i < data.length; i++) {
      console.log(data[i].name)
      securityNames.push(data[i].name);
    }

    res.json({list:securityNames});
  }).catch(function (err) {
    console.log("Error in database")
});


});

//responds to add user post request, (when someone logged in)
router.post('/addUser', function (req, res){
  console.log(req.body)
  res.json({username: req.body.username});
});

//responds to add security post request (changes database)
router.post('/addSecurity', function (req, res) {
  console.log("Recieved a request to add the stock " + req.body.stock);
  db.addSecurity(req.body.stock).then(function (insert){
    console.log(insert)
    res.json({msg: "You just made and insertion of a security of" + req.body.stock});
  }) 
  
});

//responds to buy request (changes database)
router.post('/buy', function (req, res) {
  console.log("Recieved a buy request");
  db.buy(req.body.user, req.body.security, req.body.amount, req.body.price);
  res.json({msg: "you just made a buy request for: " +req.body.security});
});

//responds to sell request (changes database)
router.post('/sell', function (req, res) {
  db.sell(req.body.user, req.body.stock, req.body.amount, req.body.price);
  console.log("Receiving sell");
  res.json({msg: "you just made a sell request for: " + req.body.stock});
});


//responds to view all trades and order request
router.post('/getInfo', function(req, res) {

  db.getBuys(req.body.name).then( function(buys) {
    db.getSells(req.body.name).then( function(sells){
      db.getTrades(req.body.name).then( function(trades){
          var buyData =  JSON.parse(JSON.stringify(buys));
          var sellData =  JSON.parse(JSON.stringify(sells));
          var tradeData = JSON.parse(JSON.stringify(trades));

          console.log(buyData);
          res.json({trades: tradeData, buys: buyData, sells: sellData})

      });
    });
  });

});

module.exports = router;
