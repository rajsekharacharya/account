angular.module("Application").controller("UserManagementController", function ($scope, $http,DTOptionsBuilder) {
    $scope.form = {};
    $scope.views = {};
    $scope.views.list = true;
    $scope.showPassword = false;
    $scope.togglePassword = function () {
      $scope.showPassword = !$scope.showPassword;
    };
    $scope.dtOptions = DTOptionsBuilder.newOptions()
      .withOption("stateSave", true)
      .withOption("lengthMenu", [
        [5, 10, 50, 100, 1000, -1],
        [5, 10, 50, 100, 1000, "All"],
      ])
      .withOption("pageLength", 10) // Add default page length
      .withOption("dom", "lBfrtip") // Add dom option
      .withButtons([
        {
          extend: "collection",
          text: '<span class="lbl-dropdown">Export</span><span class="icon-common icon-btn-dropdown icon-chevron"></span>',
          buttons: [
            {
              extend: "excel",
              text: '<span class="icon-common icon-dropdown-action icon-excel"></span><span class="lbl-dropdown-action">Excel</span>', // Icon for Excel
              className: "btn btn-success",
              title: "User",
              exportOptions: {
                columns: ":not(:nth-last-child(-n+2))",
                modifier: {
                  page: "current",
                },
                header: false, // Exclude the header row
              },
            },
            {
              extend: "print",
              text: '<span class="icon-common icon-dropdown-action icon-print"></span><span class="lbl-dropdown-action">Print</span>',
              autoPrint: true,
              exportOptions: {
                columns: ":not(:nth-last-child(-n+2))",
                modifier: {
                  page: "current",
                },
              },
            },
          ],
        },
      ]);


    autoUserListFetch();
    function autoUserListFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/user/getUsers",
      }).then(
        function successCallback(response) {
          $scope.users = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.AddUser = function () {
      $scope.form = {};
      $("#add_edit_user_modal").modal("show");
      $("#user-name-error").hide();
      $("#user-name-error-edit").hide();
    };

    $scope.editUser = function (user) {
      showHideLoad();
      $scope.form = user;
      $("#add_edit_user_modal").modal("show");
      $("#user-name-error").hide();
      $("#user-name-error-edit").hide();
      showHideLoad(true);
    };

    $scope.close = function () {
      $scope.form = {};
      $("#add_edit_user_modal").modal("hide");
    }

    $scope.saveUser = function () {
      showHideLoad();
      if ($scope.form.id == "" || $scope.form.id == undefined) {
        var method = "POST";
        var url = "api/user/addUser";
      } else {
        var method = "PUT";
        var url = "api/user/updateUser";
      }
      $http({
        method: method,
        url: url,
        data: angular.toJson($scope.form),
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(_success, _error);
    };

    function _success(response) {
      showHideLoad(true);
      $("#add_edit_user_modal").modal("hide");
      autoUserListFetch();
      Swal.fire({
        text: response.data,
        icon: "success",
        buttonsStyling: !1,
        confirmButtonText: "Ok, got it!",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      });
    }

    function _error(response) {
      showHideLoad(true);
      Swal.fire({
        text: response.data,
        icon: "error",
        buttonsStyling: !1,
        confirmButtonText: "Ok, got it!",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      });
    }

    $scope.changeStatus = function (id) {
      showHideLoad();
      $http({
        method: "PUT",
        params: { id: id },
        url: "api/user/accountStatusToggle",
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(
        function successCallback(response) {
          //console.log(response.data);
          autoUserListFetch();
          showHideLoad(true);
        },
        function errorCallback(response) {
          //console.log(response.statusText);
        }
      );
    };

    $scope.checkUserNameAvailability = function (username) {
      $http({
        method: "GET",
        params: { username: username },
        url: "api/user/usernameAvailability",
      }).then(
        function successCallback(response) {
          //console.log(response.data);
          if (response.data == false) {
            $("#user-name-error").hide();
            $("#user-name-error-edit").hide();
          } else {
            $("#user-name-error").show();
            $("#user-name-error-edit").show();
          }
        },
        function errorCallback(response) {
          //console.log(response.statusText);
        }
      );
    };
    $scope.checkEmailAvailability = function (email) {
      $http({
        method: "GET",
        params: { email: email },
        url: "api/user/emailAvailability",
      }).then(
        function successCallback(response) {
          //console.log(response.data);
          if (response.data == false) {
            $("#email-error").hide();
            $("#email-error-edit").hide();
          } else {
            $("#email-error").show();
            $("#email-error-edit").show();
          }
        },
        function errorCallback(response) {
          //console.log(response.statusText);
        }
      );
    };
  });
