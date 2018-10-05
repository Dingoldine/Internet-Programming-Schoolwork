var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var expressSession = require('express-session');
var sharedsession = require('express-socket.io-session');

var port = 8080;
var app = express();
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
var session = expressSession({
    secret: "jhasbdoadh/ERR",
    resave: true,
    saveUninitialized: true,
  });
app.use(session);

var httpServer = http.Server(app);
var io = require('socket.io').listen(httpServer);
io.use(sharedsession(session));

var router = require('./controller.js');
app.use('/API', router);

//initialize socketController, keeps track of "rooms", subscribes, unsubscribes users
var socketController = require('./socketController.js');
io.on('connection', function (socket) {
  socketController(socket, io);
});


//initialize database
var db = require('./dbmodel.js');
db.init(io);


//start listening to port, throw error if in use
httpServer.listen(port, function () {
  console.log("server listening on port", port);
}).on( 'error', function (e) { 
  if (e.code == 'EADDRINUSE') { 
    throw new Error("Port adress in use, kill the running process and start the server again!");
  }
});
