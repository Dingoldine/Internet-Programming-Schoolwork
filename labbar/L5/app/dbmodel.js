"use strict";
//io used to signal changes to clients
var io;

//variable used further down to check if its necessary to update an entry or not
var recursiveCall = false;

var Async = require("async"); 
var Sequelize = require('sequelize');

//assigns the variable io
exports.init = function (ioIn){
  io = ioIn;
}

//Connect to local mySQL database
var sequelize = new Sequelize('rume', 'root', 'gfc01051', {
  host: 'localhost',
  dialect: 'mysql',
  omitNull : true,
  pool: {
    max: 2,
    min: 0,
    idle: 1000
  },
  define: {
    timestamps: false  // I don't want timestamp fields by default
  }, 
});
sequelize
.authenticate()
.then(function(err) {
  console.log('Connection to the database has been established successfully.');
})
.catch(function (err) {
  console.log('Unable to connect to the database:', err);
});

//Define database table structure
var Securities = sequelize.define('securities', {
  name: {
    type: Sequelize.STRING
  },
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    initialAutoIncrement: 1
  }
});

//Define database table structure
var Orders = sequelize.define('orders', {
  name: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.STRING
  },
  price: {
    type: Sequelize.FLOAT
  },
  amount: {
    type: Sequelize.INTEGER
  },
  uid: {
    type: Sequelize.STRING
  },
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    initialAutoIncrement: 1
  }
});

//Define database table structure
var Trades = sequelize.define('trades', {
  name: {
    type: Sequelize.STRING
  },
  price: {
    type: Sequelize.FLOAT
  },
  amount: {
    type: Sequelize.INTEGER
  },
  buyer: {
    type: Sequelize.STRING
  },
  seller: {
    type: Sequelize.STRING
  },
  dt: {
    type: Sequelize.DATE
  }, 
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    initialAutoIncrement: 1
  }

});

/* 
Get fucntions, returns from the database 

*/
exports.getSecurities = function(){

  return Securities.findAll({

  }).then(function(result) {
    return result
  }).catch(function (err) {
   console.log("Table securities does not exist")
});


};

exports.getTrades = function(name) {

  return Trades.findAll({
    where:
    {
      name: name,
    }
  }).then(function(result) {
    return result;
  });
}


exports.getBuys = function(name) {

  return Orders.findAll({
    where:
    {
      name: name,
      type: "BUY",
    }
  }).then(function(result) {
    return result;
  });
}

exports.getSells = function(name, type) {

  return Orders.findAll({
    where:
    {
      name: name,
      type: "SELL",
    }
  }).then(function(result) {
    return result;
  });
}

//adds a security into table securities
exports.addSecurity = function(nameIn) {

  return sequelize.sync({
    force: false
  })
  .then(function() {
  
  return Securities.create({
      name: nameIn,
    }).then(function(insertedArticle) {
      //securityModel.addSecurity(insertedArticle.name)
      console.log("\n" + " Successfull insertion of security "  +  insertedArticle.name);
      return insertedArticle;
    })
  });
}

//Add buy order into Orders table, afterwards tries to match a sell order
exports.buy = function(buyer, securityName, orderAmount, priceAmount) {

  Securities.findAll({
    where: {
      name: securityName
    }
  }).then(function (data) {

    var queryResult = JSON.parse(JSON.stringify(data))
    var orderType = "BUY";

    //if empty list user tries to trade a nonexisting stock
    if(queryResult.length < 1){
      console.log("Stock does not seem to exist..");
      
    }

    else {

      sequelize.sync({

        force: false

      }).then(function() {

        Orders.create({
          type: orderType,
          uid: buyer,
          name: securityName,
          amount: orderAmount,
          price: priceAmount,
        }).then(function(lastInsertedRow){  

           var entry = {
            type: orderType,
            uid: buyer,
            name: securityName,
            amount: orderAmount,
            price: priceAmount,
            id: lastInsertedRow.id
           }
          //push the order to the security order list
          //var security = securityModel.findSecurity(securityName);
          //security.addBuy(entry);
          //make clients subscribed aware of the update via sockets
          io.to(securityName).emit("buyUpdate", entry);
          //Try to match a sell order
          exports.matchSellOrder(securityName, priceAmount, orderAmount, lastInsertedRow.id, buyer);

        }).catch(function(err) {
          
            console.log(err);

        })
      });
    }
  })
};

//Called after a buy order has been made to try to match a sell
exports.matchSellOrder = function(name, price, amount, id, buyer){
    
    Orders.findAll({
    where: {
      name: name,
      type: "SELL",
    }
  }).then(function (data) {

    var queryResult = JSON.parse(JSON.stringify(data));
    console.log(queryResult)
    var i = 0;

    //works like a for loop that waits for inside asynchronous 
    //code to finnish before moving on to the next iteration
    Async.whilst(
      function () { return i < queryResult.length; },
      function (callback) {
        var sellOrder = queryResult[i];
        i++;

        console.log("Right now processing order with ID: " + sellOrder.id);

        console.log("Price of potential match: " + sellOrder.price);
        console.log("Price of inserted article: " + price);
        
        //if an asset is on sale below the ask price the trade goes through
        if(sellOrder.price <= price){
          console.log("\n Match!")
          var remainder = Math.abs(amount - sellOrder.amount);

          //the buy is bigger than the sell, terminate sell order and update buy
          if(amount > sellOrder.amount){
              console.log("the buy is bigger than the sell, terminate sell order and update buy")
              exports.destroyOrder(sellOrder.id, name);
              exports.createTrade(name, price, sellOrder.amount, buyer, sellOrder.uid);

              exports.updateOrder(id, remainder)
          }
          //the sell order is bigger than the buy, terminate buy order and update sell 
          else if(amount < sellOrder.amount){
            console.log("the sell order is bigger than the buy, terminate buy order and update sell ")
            exports.destroyOrder(id, name);
            exports.createTrade(name, price, amount, buyer, sellOrder.uid);

            exports.updateOrder(sellOrder.id, remainder)
          }

          //complete match on amount and price
          else{
            console.log("complete match on amount, terminate both orders")
            //Create the trade
            exports.destroyOrder(sellOrder.id, name);
            exports.destroyOrder(id, name);
            exports.createTrade(name, price, amount, buyer, sellOrder.uid);
            callback(1);
          }
        }

        else{
          console.log("No Match: moving on to next")
          callback();
        }
          
      },
    function (err) {

      console.log("Finnished updating")
      
      //incase a recursive callback from updateOrder has happened
      //this is to update the original order when half of it has gone through
      if (recursiveCall){
        recursiveCall = false; //set it back to false

        var entry = {
        type: "BUY",
        uid: buyer,
        name: name,
        amount: amount,
        price: price,
        id: id
       } 

      //update via sockets
      io.to(name).emit('destroyObject', id);
      io.to(name).emit("buyUpdate", entry);

      } 
    }
    );
  });
};

//function called after a sell order has been inserted to try and match a buy
exports.matchBuyOrder = function(name, price, amount, id, seller){
  
  Orders.findAll({
    where: {
      name: name,
      type: "BUY",
    }
  }).then(function (data) {

    var queryResult = JSON.parse(JSON.stringify(data));
    console.log(queryResult)

    var i = 0;


    //works like a for loop that waits for inside asynchronous 
    //code to finnish before moving on to the next iteration
    Async.whilst(
      function () { return i < queryResult.length; },
      function (callback) {
        var buyOrder = queryResult[i];
        i++;

        console.log("Right now processing order with ID: " + buyOrder.id);

        console.log("Price of potential match: " + buyOrder.price);
        console.log("Price of inserted article: " + price);

        //if an ask price above the sellers sell price exists the trade goes through
        if(buyOrder.price >= price){

          console.log("\n Match!")
          var remainder = Math.abs(amount - buyOrder.amount);

          //the sell is bigger than the buy, terminate buy order and update sell
          if(amount > buyOrder.amount){
              console.log("the sell is bigger than the buy, terminate buy order and update sell")
              //Create the trade
              exports.destroyOrder(buyOrder.id, name);
              exports.createTrade(name, price, buyOrder.amount, buyOrder.uid, seller);

              exports.updateOrder(id, remainder);
              
            }
          //the buy order is bigger than the sell, terminate sell order and update buy 
          else if(amount < buyOrder.amount){
            console.log("the buy order is bigger than the sell, terminate sell order and update buy")
            exports.destroyOrder(id, name);
            exports.createTrade(name, price, amount, buyOrder.uid, seller);

            exports.updateOrder(buyOrder.id, remainder);
            
          }

          //complete match on amount and price
          else{
            console.log("complete match on amount, terminate both orders")
            exports.destroyOrder(buyOrder.id, name);
            exports.destroyOrder(id, name);
            exports.createTrade(name, price, amount, buyOrder.uid, seller);
            callback(1);
          }
        }

       else{
          console.log("No Match: moving on to next")
          callback();
        }
          //          //setTimeout(callback, 1000);
      },
    function (err) {

      console.log("Finnished updating")
      //incase a recursive callback from updateOrder has happened
      //this is to update the original order when half of it has gone through
      if (recursiveCall){
        recursiveCall = false; //set it back to false

        var entry = {
        type: "SELL",
        uid: seller,
        name: name,
        amount: amount,
        price: price,
        id: id
       } 

      //update via sockets
      io.to(name).emit('destroyObject', id);
      io.to(name).emit("sellUpdate", entry);

      }       
    }
    );
  });
};

//Adds a sell order into the database
exports.sell = function(seller, securityName, orderAmount, priceAmount) {

  Securities.findAll({
    where: {
      name: securityName
    }
  }).then(function (data) {

    var queryResult = JSON.parse(JSON.stringify(data))
    var orderType = "SELL";

    //user tried to trade a nonexistent security
    if(queryResult.length < 1){
      console.log("Stock does not seem to exist..");  
    }

    else {
      sequelize.sync({

        force: false

      }).then(function() {
        Orders.create({

          type: orderType,
          uid: seller,
          name: securityName,
          amount: orderAmount,
          price: priceAmount,

        }).then(function(lastInsertedRow){

           var entry = {
            type: orderType,
            uid: seller,
            name: securityName,
            amount: orderAmount,
            price: priceAmount,
            id: lastInsertedRow.id
           }
          
          //update via sockets
          io.to(securityName).emit("sellUpdate", entry);

          //match with a buy order
          exports.matchBuyOrder(securityName, priceAmount, orderAmount, lastInsertedRow.id, seller);

        }).catch(function(err) {

            console.log(err);

        })
      });
    }
  })
};

//Destroys an order, buy or sell, then updates with sockets concerned clients
//Also removes order from list in the Security model
exports.destroyOrder = function(id, name){
  
  Orders.destroy({
      where: {
      
      id : id
    
    }

  }).then(function() {

      //update via sockets
      io.to(name).emit('destroyObject', id);

  }); 

}

//Creates a trade,then updates with sockets concerned clients
//Also add trade to list in the Security model
exports.createTrade = function(name, price, amount, buyer, seller){
  var date =  new Date();

  sequelize.sync({
          force: false
        }).then(function() {
          Trades.create({
            name: name,
            amount: amount,
            price: price,
            buyer: buyer,
            seller: seller,
            dt: date
          }).then(function() {

            var entry = {
            name: name,
            amount: amount,
            price: price,
            buyer: buyer,
            seller: seller,
            dt: date
            }

            //update via sockets
            io.to(name).emit('tradeUpdate', entry);

          })
        });
}

//updates an order,then tries to match it again with a recursion call
exports.updateOrder = function(id, amount){
   recursiveCall = true; 

  Orders.update({
    amount: amount,
    }, 
    {
    where: {
      id : id
    },
  }).then(function() {

    Orders.findOne({
    where: {
      id: id,
    }
    }).then(function(updatedArticle) {

    var queryResult = JSON.parse(JSON.stringify(updatedArticle));

    //Recusive call to match on the update
    if(queryResult.type == "BUY"){
      console.log("\n RECURSION CALL")
      exports.matchSellOrder(queryResult.name, queryResult.price, queryResult.amount, queryResult.id, queryResult.uid);
    }
    else{
       console.log("\n RECURSION CALL")
      exports.matchBuyOrder(queryResult.name, queryResult.price, queryResult.amount, queryResult.id, queryResult.uid);
    }
  })
  });


  }




