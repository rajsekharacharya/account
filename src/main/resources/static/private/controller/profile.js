angular.module("Application").controller("ProfileController", function ($scope, $http) {
    autoFetchUserDetails();
    function autoFetchUserDetails() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/user/getCurrentUser",
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
