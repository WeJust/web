//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var socketio = require('socket.io');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var CryptoJS = require("crypto-js");


/** to add new object in db */
function db_add(path, object) {
    db.ref(path).set(object);
}

function db_update(json){
    db.ref().update(json);
}


/********************************************************************/


// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

//app.use(express.bodyParser());
app.use(express.static(path.resolve(__dirname, 'client')));
// Middleware session
app.use(session(
    {
        secret: 'cloud9projectRandomString0001',
        saveUninitialized: false,
        resave: false
    }
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


var messages = [];
var sockets = [];


app.get('/session', function (req, res) {
    res.send(req.session);
});


app.get('/', function (req, res) {
    res.sendFile('client/index.html', { root: __dirname });
});

app.get('/register',function (req, res) {
    res.sendFile('client/pages/signup.html', {root:__dirname});
});


io.on('connection', function (socket) {

    sockets.push(socket);

    // update player position on FireBase
    socket.on('update position', function (data) {
        var json = {};
        json["users_connected/"+socket.id+"/"] = {user : data.user, game_position : data.game_position};
        db_update(json);
    });


    socket.on('disconnect', function () {

    });


});


function broadcast(event, data) {
    sockets.forEach(function (socket) {
        socket.emit(event, data);
    });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    var addr = server.address();
    console.log("Chat server listening at", addr.address + ":" + addr.port);
});
