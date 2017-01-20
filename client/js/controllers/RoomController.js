app.controller('RoomController', function ($scope) {

    $scope.wavesLoaded = false;

    $scope.wavesurfer = WaveSurfer.create({
        container: '#waveform1'
    });
    $scope.wavesurfer2 = WaveSurfer.create({
        container: '#waveform2'
    });

    $scope.wavesurfer.load('http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/contentment_holmes_jb.mp3');
    $scope.wavesurfer2.load('http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3');


    $scope.wavesurfer.on('ready', function () {
        if ($scope.wavesLoaded==false) {
            var size = ($scope.wavesurfer2.getDuration()*100)/$scope.wavesurfer.getDuration();
            console.log($scope.wavesurfer.getDuration());
            console.log(($scope.wavesurfer2.getDuration()*100)/$scope.wavesurfer.getDuration());

            $scope.wavesurfer.destroy();
            $scope.wavesurfer2.destroy();
            $scope.wavesLoaded = true;
            console.log($scope.wavesLoaded);
        }

        if ($scope.wavesLoaded==true) {
            console.log("boucle true" + $scope.wavesLoaded);
            $("#row-wave").find("div").remove();
            $("button").before('<div id="waveform1"></div><div id="waveform2"></div><div id="waveform-timeline"></div>');
            $("#waveform2").css("width",size+"%");

            $scope.wavesurfer = WaveSurfer.create({
                container: '#waveform1',
                waveColor: 'violet',
                progressColor: 'purple',
                interact : false,
                height : 64
            });

            $scope.wavesurfer2 = WaveSurfer.create({
                container: '#waveform2',
                waveColor: 'orange',
                progressColor: 'purple',
                interact : false,
                height : 64
            });

            $scope.wavesurfer.load('http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/contentment_holmes_jb.mp3');
            $scope.wavesurfer2.load('http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3');

        }

    });


});