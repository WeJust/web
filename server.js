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
var firebase = require("firebase");

var user;
var userEmail;
var userName;
var userPhotoURL;
var emailVerified;
var uid;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCQ5_5T5oXbiH3CvyprML-fgYJds42Qbfk",
    authDomain: "wejust-def99.firebaseapp.com",
    databaseURL: "https://wejust-def99.firebaseio.com",
    storageBucket: "wejust-def99.appspot.com",
    messagingSenderId: "990839940817"
};
firebase.initializeApp(config);
var db = firebase.database();

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

/*
 app.use(app.router);
 app.use(function(req, res) {
 // Use res.sendfile, as it streams instead of reading the file into memory.
 res.sendfile('index.html');
 });*/

/*
 app.get('/', function (req, res) {
 res.sendFile('client/index.html', { root: __dirname });
 });
 app.get('/session', function (req, res) {
 res.send(req.session);
 });
 */

app.get("/register", function (req, res) {
    res.sendFile('pages/signup.html', {root:__dirnname});
});

app.post('/signup', function (req, res) {

    console.log("teeeeeeeeeeeeeeeeeeeeeeeeee");
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    /* create account */
    db_add("username/"+username,{instrument : "guitare"});

    firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(function (firebaseuser) {

            firebaseuser.updateProfile({
                displayName: username
            }).then(function () {
                res.redirect('/#!/home');
            }, function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;

                console.log("Error Firebase ! " + errorCode + " : " + errorMessage);

                res.redirect('/#!/error');
            });

        })
        .catch(function (error) {

            var errorCode = error.code;
            var errorMessage = error.message;

            console.log("Error Firebase ! " + errorCode + " : " + errorMessage);
        });


});

app.get('/getFirebaseUser', function (req, res) {
    console.log("Checkpoint reach");
    res.send(user);
});

app.post('/login',function (req, res) {

    var email = req.body.email;
    var password = req.body.password;



    firebase.auth().signInWithEmailAndPassword(email,password)
        .then(function (firebaseuser) {
            user = firebaseuser;
            uid = user.uid;
            userEmail = user.email;
            userName = user.displayName;
            emailVerified = user.emailVerified;
            userPhotoURL = user.photoURL;
            console.log(uid +" " + userEmail+" " + userName+" " + userPhotoURL + " " + emailVerified);
            res.redirect('/#!/home');
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log("Error Firebase ! " + errorCode + " : " + errorMessage);
            res.redirect("/#!/error");
        });


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
