angular.module('app',["firebase"]).controller('HomeController', function ($scope,$firebaseObject) {
      $scope.test = "test var";
      $scope.usernameValid = true;
      $scope.checkUsername=function () {
          var ref = firebase.database().ref("username/" +  $scope.usernameField);
          // download the data into a local object
          $scope.data = $firebaseObject(ref);
          ref.once('value').then(function (snapshot) {
              if (snapshot.val() != null) {
                $scope.usernameValid = false;
              } else {
                  $scope.usernameValid = true;
              }
          })
      };
      
      $scope.authentication = function () {
          var email = $scope.emailField;
          var password = $scope.passwordField;
          var username = $scope.usernameField;

          firebase.auth().createUserWithEmailAndPassword(email,password).catch(function (error) {
              var errorCode = error.code;
              var errorMessage = error.message;
              return "Error ! " + errorCode + " : "+ errorMessage;
          });

          var ref = firebase.database().ref("username").set({
              username: username
          });
      }
    });
