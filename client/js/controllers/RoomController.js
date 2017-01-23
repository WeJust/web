app.controller('RoomController', function ($scope,$interval) {
  $scope.AllDataLoaded = false;
  $scope.currentTime = 0;
  $scope.timeCursor = 0;
  /* FIREBASE PARAMS*/
  $scope.roomName = "test";
  $scope.trackNumber = 6;
  /*----------------*/

  var TracksURLs = [];
  var Colors = ['orange','blue','red','yellow','green','pink','black','grey'];
  var NumberOfTracks = 2;
  var Promises0 = [];
  var Promises = [];
  var Promises2 = [];
  var WaveSurfers = [];
  var WaveSurfersReady = false;
  var Durations = [];
  var Sizes = [];

  for ( i =0; i <$scope.trackNumber;i++){
    TracksURLs[i] = "";
  }

  $scope.playAllTracks = function(time){
    console.log($scope.currentTime);
    console.log($scope.timeCursor);
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

  $scope.updateTrack = function(num,url){

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
      $("#waveform"+num).replaceWith('<div id="waveform'+num+'" style="width : '+div_size+'%">');
      WaveSurfers[num].destroy();
      WaveSurfers[num]= WaveSurfer.create({
        container: '#waveform'+num,
        waveColor: Colors[i],
        progressColor: 'grey',
        interact : true,
        height : 64,
        hideScrollbar : true
      });
      WaveSurfers[num].load(url);
    })
  }


  TracksURLs.forEach(function(element,i) {
    Promises0[i] = new Promise(  function(resolve, reject) {
      storage.ref().child($scope.roomName+"/"+i+".wav").getDownloadURL().then(function(url) {
        TracksURLs[i] = url;
        $("#row-before-wave").append('<div id="waveform'+i+'" style="display:none">');
        WaveSurfers[i] = WaveSurfer.create({
          container: '#waveform'+i
        });
        WaveSurfers[i].load(url);
        WaveSurfers[i].on('ready', function () {
          Durations[i] = WaveSurfers[i].getDuration();
          resolve();
        })
      })
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

        WaveSurfers[i]= WaveSurfer.create({
          container: '#waveform'+i,
          waveColor: Colors[i],
          progressColor: 'grey',
          interact : true,
          height : 64,
          hideScrollbar : true
        });
        WaveSurfers[i].load(url);
      });
    });

    if ($scope.AllDataLoaded){



    }




    var updateCurrentTime = function (){
      if (Durations.indexOf($scope.maxSize) != -1)
      $scope.currentTime = WaveSurfers[Durations.indexOf($scope.maxSize)].getCurrentTime();
    };

    $interval(updateCurrentTime, 100);

  });
