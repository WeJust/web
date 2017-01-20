app.controller('HomeController', function ($scope) {

    db.ref('/rooms').once('value').then(function(snapshot) {
        $scope.AllRooms = snapshot.val();
        $scope.$apply();
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

    $scope.toArray = function(items) {
        var result = [];
        angular.forEach(items, function(value) {
            result.push(value);
        });
        return result;
    };


    $scope.selectSearch = function (array,room,value) {

        if (array[value].length == 0){
            return true;
        }else{
            return array[value].includes(room[value]);
        }

    }

    $scope.passwordAlert = function (room) {
        swal({
            title: "Enter room password",
            input: "password",
            type: "info",
            showCancelButton: false,
            confirmButtonText: "Enter the room !",
            inputAttributes: {
                'maxlength': 10,
                'autocapitalize': 'off',
                'autocorrect': 'off'
            }
        }).then(function (password) {
            if (password==room.accessPassword){
                swal({
                    title: "Password valid",
                    type: "success",
                    showConfirmButton: false,
                    timer: "1000",
                    onClose: function () {
                        window.location.href="/room"
                    }
                });
            } else {
                swal({
                    title: "Wrong password",
                    type: "error"
                })
            }
        });
    };


});
