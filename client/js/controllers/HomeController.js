angular.module('app').controller('HomeController', ['$scope', function ($scope) {
    $scope.test = "test var";
    $document.ready(function () {
        $("#passwordAlert").hide();

        $("#passwordField, #passwordConfirm").keyup(function() {

            var password = $("#passwordField").val();
            var passwordConfimr = $("#passwordConfirm").val();

            if (password.length < 6) {
                $("#passwordAlert p").html("Password must be at least 6 character long");
                $("#passwordAlert").show();
                $("#registerFormSubmit").addClass("disabled");

            } else {
                $("#registerFormSubmit").removeClass("disabled");
                $("#passwordAlert").hide();
                $("#passwordAlert p").html("Password and password confirmation are different !");
                if (password != passwordConfimr) {
                    $("#passwordAlert").show();
                    $("#registerFormSubmit").addClass("disabled");
                }
                else {
                    $("#passwordAlert").hide();
                    $("#registerFormSubmit").removeClass("disabled");
                }
            }
        });
    });
}]);
