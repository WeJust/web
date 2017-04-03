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
var busboy = require('connect-busboy');
var fileUpload = require('express-fileupload');
var request = require('request');

var fileupload2 = require('fileupload').createFileUpload('/wav_files2').middleware;

var storage = require('@google-cloud/storage');

var gcs = storage({
  projectId: 'wejust-def99',
  keyFilename: 'wejust-def99-firebase-adminsdk-ji41y-be56ee6f6e.json'
});


 var bucket = gcs.bucket('wejust-def99.appspot.com');


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
app.use(busboy());
app.use(fileUpload()); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


var messages = [];
var sockets = [];


app.get("/register", function (req, res) {
    res.sendFile('pages/signup.html', {root:__dirnname});
});

app.post('/signup', function (req, res) {

    console.log("Signup page");
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    /* create account */
    db_add("usernames/"+username,{
        email : email,
        instrument : "guitare"
    });

    firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(function (firebaseuser) {

            firebaseuser.updateProfile({
                displayName: username
            }).then(function () {
                res.redirect('/#!/');
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
    console.log("User info send !");
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

app.post('/create_room',function (req, res) {

    var json = JSON.parse(JSON.stringify(req.body));

    db.ref("rooms/"+req.body.name).set(json);
    res.redirect("/#!/home");

});

app.post('/upload_file_from_plugin', fileupload2, function (req, res) {
	console.log(req);
  console.log("*********************************************************************************************************");
  console.log(req.files);
    console.log("*********************************************************************************************************");
      console.log(req.body);
      console.log("*********************************************************************************************************");
   /* 
    var uploadRef = storageRef.child(req.body.room+"/"+req.body.trackNumber+".wav");
    
    uploadRef.put(req.files.uploadfile).then(function(snapshot) {
  console.log('Uploaded a blob or file!');
	});*/
	

  /*var options = {
  destination: req.body.room+"/"+req.body.trackNumber+".wav"
};*/


 // Upload a local file to a new file to be created in your bucket. 
/*bucket.upload(req.body.filePath,options, function(err, file) {
  if (!err) {
    // "zebra.jpg" is now in your bucket. 
      console.log(file);
  }
  console.log(err);
});*/
  
 /* var options = {
  url: 'https://www.googleapis.com/upload/storage/v1/b/wejust-def99.appspot.com/o?uploadType=media&name=myObject',
  headers: {
    'Content-Type': 'audio/wav',
    'Content-Length' : req.headers["content-length"]
  },
  body : req.files.uploadfile.data
};
  function callback(error, response, body) {
    console.log("1111111111111111111111111111111111");
  console.log(error);
  console.log("1111111111111111111111111111111111");
  console.log(response);
    console.log("1111111111111111111111111111111111");
  console.log(body);
    console.log("1111111111111111111111111111111111");
  
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    console.log(info.stargazers_count + " Stars");
    console.log(info.forks_count + " Forks");
  }
}

request.post(options, callback);
res.end();*/


res.redirect("/#!/home");
});
app.get('/upload_file_from_plugin',function (req, res) {

console.log(req)
  console.log("-- GET -- UPLOADDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
  res.redirect("/#!/home");

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
