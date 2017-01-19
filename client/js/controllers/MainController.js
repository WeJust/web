app.controller('MainController',function ($scope,$http) {
    $http.get("/getFirebaseUser").then(function (user) {
        $scope.firebaseUser = user.data;
        console.log(user.data);
    });

    $scope.userInfo = function () {
        $scope.uid = $scope.firebaseUser.uid;
        $scope.userName = $scope.firebaseUser.displayName;
        $scope.userEmail = $scope.firebaseUser.email;
        $scope.emailVerified = $scope.firebaseUser.emailVerified;
        console.log($scope.uid);
        Materialize.toast($scope.uid + " " + $scope.userName + " " + $scope.userEmail + " "
            +$scope.emailVerified,2000);
    }
});