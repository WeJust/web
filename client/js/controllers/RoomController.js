app.controller('RoomController', function ($scope,$routeParams,$interval) {
console.log($routeParams);
  $scope.AllDataLoaded = false;
  $scope.currentTime = 0;
  $scope.timeCursor = 0;
  /* FIREBASE PARAMS*/
  $scope.roomName = $routeParams.j;
  $scope.trackNumber = 5;
  /*----------------*/
  
    $http.get("/getFirebaseUser").then(function (user) {
        $scope.firebaseUser = user.data;
        console.log(user.data);
    });

  var Colors = ['orange','blue','red','yellow','green','pink','black','grey'];
  var Promises0 = [];
  var Promises = [];
  var Promises2 = [];
  var WaveSurfers = [];
  var Durations = [];
  var Sizes = [];
  
  $scope.message_value = "";
  
  $scope.chat = [];
  
   var socketio = io("/"+$scope.roomName);
   var socket_serveur = io();

 
socketio.on('updateTrack', function (data) {
	console.log(data);
	console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOK TRIGGER");
	$scope.updateTrack(data.num);
});

socketio.on('new_message', function (data) {
	$scope.chat.push(data);
	console.log(data);
	console.log($scope.chat);
	$scope.message_value = "";
});


  $scope.message = function(data){
	console.log("click");
    socket_serveur.emit("new_message",{room : $scope.roomName, user : $scope.firebaseUser.displayName ,message : data});

  };


  for ( i =0; i <$scope.trackNumber;i++){
    TracksURLs[i] = "";
  }

  $scope.playAllTracks = function(time){
    TracksURLs.forEach(function(url,i) {
      if (time < WaveSurfers[i].getDuration())
      WaveSurfers[i].play(time);
    });
  }
  $scope.pauseAllTracks = function(){
    TracksURLs.forEach(function(url,i) {
      WaveSurfers[i].pause();
    });
  }

  $scope.placeCursor = function(time){
    $scope.currentTime = time;
    TracksURLs.forEach(function(url,i) {
      if (WaveSurfers[i] && time < WaveSurfers[i].getDuration()){
        WaveSurfers[i].play(time);
        WaveSurfers[i].pause();
      }else if (WaveSurfers[i] && time >= WaveSurfers[i].getDuration()){
        WaveSurfers[i].play(WaveSurfers[i].getDuration());
        WaveSurfers[i].pause();
      }
    });
  }

  $scope.updateTrack = function(num){
  
  socketio.emit("updateTrack",{num : 6});

    storage.ref().child($scope.roomName+"/"+num+".wav").getDownloadURL().then(function(url) {
      TracksURLs[num] = url;
      $("#wavform"+num).replaceWith('<div id="waveform'+num+'" style="display:none">');
      WaveSurfers[num] = WaveSurfer.create({
        container: '#waveform'+num
      });
      WaveSurfers[num].load(url);
      WaveSurfers[num].on('ready', function () {
        Durations[num] = WaveSurfers[num].getDuration();
        resolve();
      })

      WaveSurfers[num].destroy();
      WaveSurfers[num]= WaveSurfer.create({
        container: '#waveform'+num,
      });
      WaveSurfers[num].load(url);
      WaveSurfers[num].on('ready', function () {
        var size = WaveSurfers[num].getDuration();
        if (size > $scope.maxSize){
          $scope.maxSize = size;

          /*
          il faut resize toute les wavforms ici
          */

        }
        var div_size = size*100/$scope.maxSize;
        $("#waveform"+num).replaceWith('<div id="waveform'+num+'" style="width : '+div_size+'%" >');
        WaveSurfers[num].destroy();
        WaveSurfers[num]= WaveSurfer.create({
          container: '#waveform'+num,
          waveColor: Colors[num],
          progressColor: 'grey',
          interact : true,
          height : 64,
          hideScrollbar : true
        });
        WaveSurfers[num].load(url);
      })
    });
  }



  TracksURLs.forEach(function(element,i) {
    Promises0[i] = new Promise(  function(resolve, reject) {
      storage.ref().child($scope.roomName+"/"+i+".wav").getDownloadURL().then(function(url) {
        TracksURLs[i] = url;
        $("#row-before-wave").append('<div id="waveform'+i+'" style="display:none" >');
        WaveSurfers[i] = WaveSurfer.create({
          container: '#waveform'+i
        });
        WaveSurfers[i].load(url);
        WaveSurfers[i].on('ready', function () {
          Durations[i] = WaveSurfers[i].getDuration();
          resolve();
        })
      }).catch(function(error) {
		resolve();
      });
    })
  })

  Promise.all(Promises0).then(function() {
    $scope.maxSize = Math.max(...Durations);
    TracksURLs.forEach(function(url,i) {
      WaveSurfers[i].destroy();
      Sizes[i] = Durations[i]*100/$scope.maxSize;
      Promises2[i] = new Promise(
        function(resolve, reject) {
          WaveSurfers[i].on('ready', function () {
            resolve();
          })
        });
      });
    });
    

    Promise.all(Promises0.concat(Promises.concat(Promises2))).then(function(){
      $scope.AllDataLoaded = true;
      console.log("All data loaded");
      $("#row-before-wave").find("div").remove();
      TracksURLs.forEach(function(url,i) {
	
        $("#row-after-wave").before('<div id="waveform'+i+'">');
        $("#waveform"+i).css("width",Sizes[i]+"%");
	var waveform_dl_div = $("<a>Track n°"+(i+1)+" :</a>");
	waveform_dl_div.attr("id","waveform_dl"+i);
	waveform_dl_div.attr("href",TracksURLs[i]);
	waveform_dl_div.attr("download","");
	$("#waveform"+i).append(waveform_dl_div);

        WaveSurfers[i]= WaveSurfer.create({
          container: '#waveform'+i,
          waveColor: Colors[i],
          progressColor: 'grey',
          interact : true,
          height : 64,
          hideScrollbar : true
        });
        WaveSurfers[i].load(url);

        WaveSurfers[i].on('seek', function (progress) {
          $scope.placeCursor(WaveSurfers[i].getCurrentTime());
          $scope.timeCursor = WaveSurfers[i].getCurrentTime()*10000;
        });

      });
    });

    var updateCurrentTime = function (){
      if (Durations.indexOf($scope.maxSize) != -1)
      $scope.currentTime = WaveSurfers[Durations.indexOf($scope.maxSize)].getCurrentTime();
    };

    $interval(updateCurrentTime, 10);

  });
