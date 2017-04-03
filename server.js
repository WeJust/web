//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var fs = require('fs');
var socketio = require('socket.io');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var CryptoJS = require("crypto-js");
var firebase = require("firebase");
var busboy = require('connect-busboy');
var fileUpload = require('express-fileupload');
var request = require('request');
var Multer = require('multer');

//var Upload = require('upload-file');

var Storage = require('@google-cloud/storage');


//var fileupload2 = require('fileupload').createFileUpload(__dirname+'/client/uploadDir').middleware;

//var storage_instance = Storage();
/*
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 300 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});*/



var gcs = Storage({
  projectId: 'wejust-def99',
  keyFilename: 'wejust-def99-firebase-adminsdk-ji41y-be56ee6f6e.json'
});



/*gcs.createBucket('octocats', function(err, bucket) {

    // Error: 403, accountDisabled
    // The account for the specified project has been disabled.

    // Create a new blob in the bucket and upload the file data.
    var blob = bucket.file("octofez.png");
    var blobStream = blob.createWriteStream();

    blobStream.on('error', function (err) {
        console.error(err);
    });

    blobStream.on('finish', function () {
        var publicUrl = "https://storage.googleapis.com/${bucket.name}/${blob.name}";
        console.log(publicUrl);
    });

    fs.createReadStream("octofez.png").pipe(blobStream);
});*/





 //var bucket = gcs.bucket('wejust-def99.appspot.com');


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

app.post('/upload_file_from_plugin', function (req, res) {

 var sampleFile = req.files[Object.keys(req.files)[0]];
 console.log(sampleFile);
sampleFile.mv('uploadDir/'+req.body.room+'-'+req.body.trackNumber+'.wav', function(err) {
    if (err)
      console.log(err);

     
	var options = {
	  destination: req.body.room+'/'+req.body.trackNumber+'.wav'
	};
	var bucket = gcs.bucket('wejust-def99.appspot.com');     
	      bucket.upload('uploadDir/'+req.body.room+'-'+req.body.trackNumber+'.wav',options, function(err, file) {
	  if (!err) {
	   console.log('File uploaded!');
	   fs.unlink('uploadDir/'+req.body.room+'-'+req.body.trackNumber+'.wav', function(err){
	   console.log("Tmp file delete !");
	   
		var nsp = io.of('/'+req.body.room);
		nsp.emit('updateTrack',{num : req.body.trackNumber});
		//io.to(req.body.room).emit('updateTrack',{num : req.body.trackNumber});
	   });
	    // "zebra.jpg" is now in your bucket. 
	  }else{
	  console.log(err);
		fs.readdir(__dirname, (err, files) => {
			files.forEach(file => {
		console.log(file);
			});
		})
		console.log("CLIENNNNNNNNNNNNNNNT");
		fs.readdir(__dirname+"/client", (err, files) => {
			files.forEach(file => {
		console.log(file);
			});
		})
		console.log("Upload :");
				fs.readdir(__dirname+"/uploadDir", (err, files) => {
			files.forEach(file => {
		console.log(file);
			});
		})
	  }
	});
 

  });

res.redirect("/#!/home");
});
app.get('/upload_file_from_plugin',function (req, res) {

console.log(req)
  console.log("-- GET -- UPLOADDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
  res.redirect("/#!/home");

});


io.on('connection', function (socket) {

	sockets.push(socket);
	console.log('a user connected');
	
	
	

    socket.on('disconnect', function () {
	console.log('a user disconnected');
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
