var app = angular.module("ProfileManagement", []);

app.controller("ProfileController", function ($scope, $http, $timeout) {

    autoFetchUserDetails();
    function autoFetchUserDetails() {
      showHideLoad();
      $http({
        method: "GET",
        url: "user/getLoginUser",
      }).then(
        function successCallback(response) {
          //console.log(response);
          $scope.user = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          //console.log(response.statusText);
        }
      );
    }

});
