$(document).ready(function () {
    $("#passwordAlert").hide();

    $("#passwordField").change(function () {
       if ($("#passwordField").val()!=$("#passwordConfirm").val()) {
           $("#passwordAlert").show();
           $("#registerFormSubmit").addClass("disabled");
       }
       else {
           $("#passwordAlert").hide();
           $("#registerFormSubmit").removeClass("disabled")
       }
    });
});