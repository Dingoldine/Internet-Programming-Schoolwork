/* jslint node: true */
"use strict";

var db = require('./dbmodel.js');

module.exports = function (socket, io) {


  // user joins admin rooms
  socket.on('joinAdmin', function (req) {
    var user = req.user;

    //subscribe the user
    socket.join(user);
    console.log(user +  ' started viewing admin page');

  });

  // user leaves security
  socket.on('leaveAdmin', function (req) {
    var user = req.user;

    //unsubscribe user
    socket.leave(user);
    console.log(user +  ' stopped viewing admin page');
  });



  socket.on('joinCommentSection',function (req) {
    // body...
    console.log("user joined comment section")
    socket.join('commentSection');
  });


  socket.on('leaveCommentSection',function (req) {
    console.log("user left comment section")
    socket.leave('commentSection');
  });



};
