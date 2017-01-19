app.controller('HomeController', function ($scope) {


    $scope.usernameValid = false;

    $scope.checkUsername=function () {
        var ref = db.ref("username/" +  $scope.usernameField);
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
