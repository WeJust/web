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

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAWFIlsHUE_FCPZjJZxDgQ2aeUrMlJV2vY",
    authDomain: "cloud9project-a4d2b.firebaseapp.com",
    databaseURL: "https://cloud9project-a4d2b.firebaseio.com",
    storageBucket: "cloud9project-a4d2b.appspot.com",
    messagingSenderId: "390910647243"
  };
  firebase.initializeApp(config);
var db = firebase.database();

/** Firebase functions **********************************************/

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

app.get('/chat', function (req, res) {
   res.sendFile('client/chat.html', { root: __dirname });
});

app.get('/', function (req, res) {
   res.sendFile('client/index.html', { root: __dirname });
});

app.get('/play', function (req, res) {
   res.sendFile('client/game.html', { root: __dirname });
});


app.get('/game', function (req, res) {

    if (req.session.user){
     res.redirect('/play?u='+CryptoJS.AES.encrypt(req.session.user, "tomiproject"));
    }else{
      res.sendFile('client/login.html', { root: __dirname });
    }

});

app.get('/logout', function (req, res) {
  req.session.user = null;
   res.sendFile('client/login.html', { root: __dirname });
});

app.get('/login', function (req, res) {
   res.sendFile('client/login.html', { root: __dirname });
});

app.post('/login',function (req, res) {

var username = req.body.username;
var pass = req.body.password;
    db.ref('/users/'+username).once('value').then(function(snapshot) {

      var userpass = snapshot.val().password;
      console.log(session);
      if (pass == userpass){
        req.session.user = username;
        //socket.handshake.session.userdata = username;
        res.redirect('/game');
      }else{
            res.send("login error");
      }
    });
});

app.get('/signup', function (req, res) {
   res.sendFile('client/signup.html', { root: __dirname });
});

app.post('/signup', function (req, res) {

var username = req.body.username;

  if (req.body.password != req.body.password2){
    res.send("password error");
  }else{
    db.ref('/users/' + username).once('value').then(function(snapshot) {
    if (snapshot.val()){
      res.send("username already taken");
    }else{
      /* create account */
      db_add("users/"+username,{password : req.body.password, game_position : {x:0,y:0,z:0}});

      res.redirect('/login');
    }
    });
  }
});

app.post('/signup', function (req, res) {

var username = req.body.username;

  if (req.body.password != req.body.password2){
    res.send("password error");
  }else{
    db.ref('/users/' + username).once('value').then(function(snapshot) {
    if (snapshot.val()){
      res.send("username already taken");
    }else{
      /* create account */
      db_add("users/"+username,{password : req.body.password, game_position : {x:0,y:0,z:0}});

      res.redirect('/login');
    }
    });
  }
});


io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    sockets.push(socket);

      // update player position on FireBase
      socket.on('update position', function (data) {
           var json = {};
           json["users_connected/"+socket.id+"/"] = {user : data.user, game_position : data.game_position};
           db_update(json);
      });

      //detect new player connected on FireBase
      // db.ref('users_connected/').on('child_added', function(snapshot) {
      //   socket.emit("new player",{id : snapshot.key, info  : snapshot.val()});
      // });

      //detect player moving on FireBase
      db.ref('users_connected/').on('child_changed', function(snapshot) {
        socket.emit("update player position",{id : snapshot.key, info  : snapshot.val()});
      });

      //detect player disconnected on FireBase
       db.ref('users_connected/').on('child_removed', function(snapshot) {
         socket.emit("remove player",{id : snapshot.key});
       });


      socket.on('disconnect', function () {
        sockets.splice(sockets.indexOf(socket), 1);
        db.ref('users_connected/'+socket.id).remove();
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
