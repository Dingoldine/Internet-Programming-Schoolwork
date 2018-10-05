"use strict";
//io used to signal changes to clients
var io;

//variable used further down to check if its necessary to update an entry or not
var recursiveCall = false;

var Async = require("async"); 
var Sequelize = require('sequelize');
//sequelize operators
const Op = Sequelize.Op;

//assigns the variable io
exports.init = function (ioIn){
  io = ioIn;
}

//Connect to local mySQL database
var sequelize = new Sequelize('ellora', 'root', 'gfc01051', {
  host: 'localhost',
  dialect: 'mysql',
  omitNull : true,
  pool: {
    max: 2,
    min: 0,
    idle: 1000
  },
  define: {
    timestamps: false,  // I don't want timestamp fields by default
    underscored: true
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
var Tables = sequelize.define('table', {
  size: {
    type: Sequelize.INTEGER
  },
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    initialAutoIncrement: 1
  }
});

var Customers = sequelize.define('customer', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    initialAutoIncrement: 1
  },
  name: {
    type: Sequelize.STRING
  },
  email:{
    type: Sequelize.STRING
  }
});

var Reservations = sequelize.define('reservation', {
  arrival: {
    type: Sequelize.DATE
  },
  departure: {
    type: Sequelize.DATE
  },
    id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    initialAutoIncrement: 1
  }
});

//adds table tableId and customerId attribute to Reservation to hold the primary key values of Table and Customer
Reservations.belongsTo(Tables);
Reservations.belongsTo(Customers);

var Reviews = sequelize.define('reviews', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    initialAutoIncrement: 1
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email:{
    type: Sequelize.STRING,
    allowNull: false
  },
  dt: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  review: {
    type: Sequelize.STRING(1000),
    allowNull: false
  },
  stars: {
    type: Sequelize.INTEGER,
    allowNull: false
  }

});

var Items = sequelize.define('items', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    initialAutoIncrement: 1
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price:{
    type: Sequelize.INTEGER,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING(1000),
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  }

});


var OrderItems = sequelize.define('orderItems', {
  id: {
  type: Sequelize.INTEGER,
  autoIncrement: true,
  primaryKey: true,
  initialAutoIncrement: 1
  },
  quantity: {
    type: Sequelize.INTEGER
  }
});

//adds Items_ID fk to orderItems
OrderItems.belongsTo(Items);

var Orders = sequelize.define('orders', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    initialAutoIncrement: 1
  },
  amount: {
    type:Sequelize.INTEGER
  }
});

//adds customer_ID fk to orders
Orders.belongsTo(Customers);
//adds order_ID fk to OrderItems,  Instances of orders will get the accessors getOrderItems and setOrderItems. 
Orders.hasMany(OrderItems)
/* 



Get functions, returns from the database 

*/
exports.getReviews = function(){

  return Reviews.findAll({

  }).then(function(result) {
    return result
  });

};

exports.getReservations = function(){

  return Reservations.findAll({

  }).then(function(result) {
    return result
  });

};


exports.getItems = function(){

    return Items.findAll({

  }).then(function(result) {
    return result
  });

};


exports.getOrders = function(){
    var orders = []

    return new Promise((resolve, reject) => {
      Orders.findAll({

    }).then(function(orderList) {
    
      console.log("\n")
      var i = 0;

        Async.forEach(orderList, function(order, callback) {
          
        return order.getOrderItems().then(function (result) {
          
          var i = 0;
          var itemList = []


          Async.forEach(result, function(item, callback1) {
                var quantityInfo = JSON.parse(JSON.stringify(item));

                item.getItem().then(function (item){
                  var itemInfo = JSON.parse(JSON.stringify(item));
                  var entry = {
                    name: itemInfo.name,
                    quantity: quantityInfo.quantity,
                  }
                  itemList.push(entry)

                  i++;
                  callback1();
                });
              },
            function (err) {
              console.log("done extracting items from the order..")
              console.log(itemList)
              order.getCustomer().then(function(customer) {
                  console.log(customer.name)
                  var orderInfo = JSON.parse(JSON.stringify(order));

                  var entry = {
                    name: customer.name,
                    totalAmount: order.amount,
                    order: itemList
                  }

                  orders.push(entry)
                  callback();
              });

            })

            }); 
          }, 
          function(err) {
            console.log("Done extracting all orders ");
            console.log('Process Finished');
            resolve(orders);
            return orders;
        }); 

      })

  }).then( function (finnaly){
      return finnaly
    });

}








/*Add functions, adds to and modifies the database */


exports.addReview = function(nameIn, emailIn, starsIn, reviewIn){
  return sequelize.sync({
    force: false
  })
  .then(function() {
  return Reviews.create({
      name: nameIn,
      email: emailIn,
      stars: starsIn,
      review: reviewIn,
      dt: Date.now()

    }).then(function(insertedArticle) {
      console.log("\n" + " Successfull insertion of Review"  +  insertedArticle)

      var entry = {
        name: nameIn,
        email: emailIn,
        stars: starsIn,
        review: reviewIn,
        dt: Date.now()
      }

      io.to('commentSection').emit("newReview", entry);

      return insertedArticle
    });
  });
};


//adds a security into table securities
exports.addCustomer = function(nameIn, emailIn) {
  return sequelize.sync({
    force: false
  })
  .then(function() {
  
  return Customers.findAll({
        where:
    {
      name: nameIn,
      email: emailIn,
    }
  }).then(function(result) {
    var queryResult = JSON.parse(JSON.stringify(result));

    if(queryResult.length > 0){
      var error = {response: "error"}
      return error
    }
    else{
        
      return Customers.create({
      name: nameIn,
      email: emailIn

    }).then(function(insertedArticle) {
      console.log("\n" + " Successfull insertion of customer"  +  insertedArticle)
      return insertedArticle
    })

    }

    });
  }); 
}

//adds a security into table securities
exports.addReservation = function(nameIn, numberOfPeopleIn, timeIn, emailIn) {

  console.log("\n")
  console.log("time passed in: "+ timeIn);

  return sequelize.sync({
    force: false
  })
  .then(function() {
    
    //`reservation`.`arrival` >= '2019-04-01 11:30:00' OR `reservation`.`departure` <= '2019-04-01 11:30:00');
    return Reservations.findAll({
      attributes: ['table_id'],
      where: {
         [Op.and]: [{arrival: {[Op.lte]: timeIn}}, {departure: {[Op.gte]: timeIn}}]

      }
    }).then(function(result) {
        var queryResult = JSON.parse(JSON.stringify(result));


      var tableList = [];
      var i = 0;
      
      //works like a for loop that waits for inside asynchronous 
      //code to finnish before moving on to the next iteration
      Async.whilst(
        function () { return i < queryResult.length; },
        function (callback) {
          var table = queryResult[i];
          tableList.push(table.table_id);
          i++;
          callback();
        },
      function (err) {
        console.log("async loop done..")
      //exports.checkAvailibility(tableList, numberOfPeopleIn, nameIn, timeIn, emailIn);
      }
      );

      console.log("proceesing..")
      return exports.checkAvailibility(tableList, numberOfPeopleIn, nameIn, timeIn, emailIn);
  
    });

  });
}

exports.checkAvailibility = function(tableList, numberOfPeopleIn, nameIn, timeIn, emailIn){

  console.log(tableList);

  return Tables.findAll({
    order: [
      'size'
    ],
    where: {
      size: {
        [Op.gte]: numberOfPeopleIn
      },
      id: {
        [Op.notIn]: tableList
      }
    }

    }).then(function (result) {

      var queryResult = JSON.parse(JSON.stringify(result));
      console.log(queryResult);

      if(queryResult.length < 1){
        var error = {response: "error"}
        console.log("There are no tables availible of that size");
        return error
      }

      else{
        console.log("proceeding with inserting reservation")

        return exports.createReservation(numberOfPeopleIn, nameIn, timeIn, queryResult[0].id, emailIn);
      }


    });
}


exports.createReservation = function(numberOfPeopleIn, nameIn, timeIn, table_id, emailIn){
  console.log("\n")
  //console.log(timeIn)

  var arrival = new Date(timeIn);
  //console.log(arrival)
  var datefromAPITimeStamp = (new Date(timeIn)).getTime();
  //console.log(datefromAPITimeStamp);

  var departure = new Date(datefromAPITimeStamp + (2 * 60*60*1000));
  //console.log(departure)

  console.log("\n")


  //convertion to local time from utc, Dont know if its best practice to store it like this or in utc?! 
  //arrival.setHours(arrival.getHours() - arrival.getTimezoneOffset() / 60);
  //departure.setHours(departure.getHours() - departure.getTimezoneOffset() / 60);

  console.log(arrival)
  console.log(departure)

  return Customers.findOne({
    attributes: ['id'],
    where: {
      name: nameIn,
      email: emailIn
    }
  }).then(function (result) {
      var queryResult = JSON.parse(JSON.stringify(result));

      var customerId = queryResult.id


      return Reservations.create({
          customer_id: customerId,
          table_id: table_id,
          arrival: arrival,
          departure: departure
      }).then( function(result) {
          var insertedArticle = JSON.parse(JSON.stringify(result));
          console.log("\n Successfull insertion of: " + insertedArticle.id)
          var entry = {
            customer_id: customerId,
            table_id: table_id,
            arrival: arrival,
            departure: departure
          }

          io.to('admin').emit("newBooking", entry);
          return insertedArticle
        });

     });

}


exports.addItem = function(itemName, itemDescription, itemPrice, itemType){

  return sequelize.sync({
    force: false
  })
  .then(function() {
  
  return Items.findAll({
        where:
    {
      name: itemName,
    }
  }).then(function(result) {
    var queryResult = JSON.parse(JSON.stringify(result));

    if(queryResult.length > 0){
      var error = {response: "error"}
      return error
    }
    else{
        
      return Items.create({
      name: itemName,
      description: itemDescription,
      price: itemPrice,
      type: itemType

    }).then(function(insertedArticle) {
      console.log("\n" + " Successfull insertion of customer"  +  insertedArticle.name)
      return insertedArticle
    })

    }

    });
  }); 
}

exports.addOrder = function(customerName, customerEmail, totalAmount, itemList){

  console.log(itemList);

  return sequelize.sync({
    force: false
  })
  .then(function() {
    return Customers.findOne({
      attributes: ['id'],
      where: {
        name: customerName,
        email: customerEmail
      }
    }).then(function (result) {
        var queryResult = JSON.parse(JSON.stringify(result));

        var customerId = queryResult.id


        return Orders.create({
            customer_id: customerId,
            amount: totalAmount
        }).then( function(result) {

          return result.getCustomer().then(function(customer) {

            var insertedArticle = JSON.parse(JSON.stringify(result));
            console.log("\n Inserted into orders: " + insertedArticle.id)

            var i = 0;
            var update = []

            Async.whilst(
              function () { return i < itemList.length; },
              function (callback) {
              var item = itemList[i];
              i++;

              OrderItems.create({
                order_id: insertedArticle.id,
                item_id: item.id,
                quantity: item.count
              })
              var entry = {
                name: item.name,
                quantity: item.count
              }
              update.push(entry)
              
              callback();
              },
            function (err) {
              console.log("async loop done..")
            
              var entry = {
                name: customer.name,
                totalAmount: totalAmount,
                order: update
              }

            io.to('admin').emit("newOrder", entry);

            }
            );


           });

        });

      });
  });
}