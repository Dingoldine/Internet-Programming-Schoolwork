/* jslint node: true */
"use strict";

var db = require('./dbmodel.js');

module.exports = function (socket, io) {

  // user joins security
  socket.on('join', function (req) {

    var name = req.name;
    var user = req.username;

    //subscribe the user
    socket.join(name);
    console.log(user +  ' started viewing ' + name);

  });

  // user leaves security
  socket.on('leave', function (req) {
    console.log(req);
    var name = req.name;
    var user = req.username;

    //unsubscribe user
    socket.leave(name);
    console.log(user +  ' stopped viewing ' + name);
  });


};
