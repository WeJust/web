app.controller('HomeController', function ($scope) {

    db.ref('/rooms').once('value').then(function(snapshot) {
        $scope.AllRooms = snapshot.val();
        $scope.$apply()
    });

    $scope.usernameValid = false;

    $scope.checkUsername=function () {
        var ref = db.ref("usernames/" +  $scope.usernameField);
        // download the data into a local object
        ref.once('value').then(function (snapshot) {
            console.log(snapshot.val());
            if (snapshot.val() != null) {
                $scope.usernameValid = false;
            } else {
                $scope.usernameValid = true;
            }
        })
    };



});
