angular
  .module("Application")
  .controller("UserController", function ($scope, $http, $timeout, DTOptionsBuilder) {
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
      // {
      //   extend: "colvis",
      //   text: '<span class="lbl-dropdown">Columns</span><span class="icon-common icon-btn-dropdown icon-chevron"></span>',
      // },
      ]);



    autoUserListFetch();
    function autoUserListFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/getUsersForSuperAdmin",
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

    $scope.getCompany = function () {
      $scope.companies = '';
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/company/getActiveCompanies",
      }).then(
        function successCallback(response) {
          $scope.companies = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    };

    $scope.AddUser = function () {
      $scope.form = {};
      $("#add_edit_user_modal").modal("show");
      $("#user-name-error").hide();
      $("#user-name-error-edit").hide();
    };

    $scope.editUser = function (user) {
      showHideLoad();
      $scope.form = user;
      if ($scope.form.role === 'ADMIN') {
        $scope.getCompany();
      }
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
        var url = "api/v1/postUserForSuperAdmin";
      } else {
        var method = "PUT";
        var url = "api/v1/putUser";
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
        url: "api/v1/deleteUser",
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(
        function successCallback(response) {
          alert(response.data);
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    };

    $scope.checkUserNameAvailability = function (username) {
      $http({
        method: "GET",
        params: { username: username },
        url: "api/v1/usernameAvailability",
      }).then(
        function successCallback(response) {
          if (response.data == false) {
            $("#user-name-error").hide();
            $("#user-name-error-edit").hide();
          } else {
            $("#user-name-error").show();
            $("#user-name-error-edit").show();
          }
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    };
    $scope.checkEmailAvailability = function (email) {
      $http({
        method: "GET",
        params: { email: email },
        url: "api/v1/emailAvailability",
      }).then(
        function successCallback(response) {
          if (response.data == false) {
            $("#email-error").hide();
            $("#email-error-edit").hide();
          } else {
            $("#email-error").show();
            $("#email-error-edit").show();
          }
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    };
  })
  .controller("UserManagementController", function ($scope, $http, $timeout, DTOptionsBuilder) {
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
                columns: ":not(:nth-last-child(-n+3))",
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
                columns: ":not(:nth-last-child(-n+3))",
                modifier: {
                  page: "current",
                },
              },
            },
          ],
        },
      // {
      //   extend: "colvis",
      //   text: '<span class="lbl-dropdown">Columns</span><span class="icon-common icon-btn-dropdown icon-chevron"></span>',
      // },
      ]);


    autoUserListFetch();
    function autoUserListFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/getUsers",
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

    $scope.fetchPlant = function (type) {
      $scope.plants = {};
      if (type === "P") {
        showHideLoad();
        $http({
          method: "GET",
          url: "api/v1/plant/getActivePlant",
        }).then(
          function successCallback(response) {
            $scope.plants = response.data;
            showHideLoad(true);
          },
          function errorCallback(response) {
            console.log(response.statusText);
          }
        );
      }
    };

    $scope.AddUser = function () {
      $scope.form = {};
      $("#add_edit_user_modal").modal("show");
      $("#user-name-error").hide();
      $("#user-name-error-edit").hide();
    };

    $scope.editUser = function (user) {
      showHideLoad();
      $scope.form = user;
      if ($scope.form.attachType === 'P') {
        $scope.fetchPlant("P");
      }
      $("#add_edit_user_modal").modal("show");
      $("#user-name-error").hide();
      $("#user-name-error-edit").hide();
      showHideLoad(true);
    };

    $scope.close = function () {
      $scope.form = {};
      $("#add_edit_user_modal").modal("hide");
    }


    $scope.updatePermission = function () {
      showHideLoad();
      let permissionsArray = [];

      angular.forEach($scope.menus, function (menu) {
        if (menu.permission) {
          permissionsArray.push(menu.permissionName);
        }

        angular.forEach(menu.submenu, function (submenu) {
          if (submenu.permission) {
            permissionsArray.push(submenu.permissionName);
          }
        });
      });

      angular.forEach($scope.userCommon, function (common) {
        if (common.permission) {
          permissionsArray.push(common.permissionName);
        }
      });

      $http({
        method: "PUT",
        url: "api/v1/updatePermission",
        params: { id: $scope.form.id, permission: permissionsArray },
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(_success, _error);

      // $scope.menus = {};
      // $("#permissionTable").modal("hide");
    }

    // $scope.addPermission = function (user) {
    //   console.log(user);
    //   $scope.form = user;
    //   $scope.userCommon = angular.copy($scope.commonPermission);

    //   if (user.attachType === 'C') {

    //     if (user.permissions.length > 0) {
    //       $scope.menus = angular.copy($scope.companyPermission);

    //       angular.forEach($scope.menus, function (menu) {
    //         // Check if any permissionName in menu matches with form.permissions
    //         angular.forEach(menu.submenu, function (submenu) {
    //           angular.forEach($scope.form.permissions, function (permission) {
    //             if (permission.name === submenu.permissionName && permission.status) {
    //               submenu.permission = true;
    //             }
    //           });
    //         });

    //         // Check main menu permission
    //         angular.forEach($scope.form.permissions, function (permission) {
    //           if (permission.name === menu.permissionName && permission.status) {
    //             menu.permission = true;
    //           }
    //         });
    //       });

    //       $("#permissionTable").modal("show");

    //     }
    //     else {
    //       $scope.menus = angular.copy($scope.companyPermission);
    //       $("#permissionTable").modal("show");
    //     }

    //   }
    //   else {
    //     if (user.permissions.length > 0) {
    //       $scope.menus = angular.copy($scope.plantPermission);

    //       angular.forEach($scope.menus, function (menu) {
    //         // Check if any permissionName in menu matches with form.permissions
    //         angular.forEach(menu.submenu, function (submenu) {
    //           angular.forEach($scope.form.permissions, function (permission) {
    //             if (permission.name === submenu.permissionName && permission.status) {
    //               submenu.permission = true;
    //             }
    //           });
    //         });

    //         // Check main menu permission
    //         angular.forEach($scope.form.permissions, function (permission) {
    //           if (permission.name === menu.permissionName && permission.status) {
    //             menu.permission = true;
    //           }
    //         });
    //       });

    //       $("#permissionTable").modal("show");

    //     }
    //     else {
    //       $scope.menus = angular.copy($scope.plantPermission);
    //       $("#permissionTable").modal("show");
    //     }

    //   }

    // }

    $scope.addPermission = function (user) {
      showHideLoad();
      $scope.form = user;
      $scope.userCommon = angular.copy($scope.commonPermission);
      let permissionsToCopy = user.attachType === 'C' ? $scope.companyPermission : $scope.plantPermission;
      $scope.menus = angular.copy(permissionsToCopy);

      if (user.permissions.length > 0) {
        // Check and set permissions for menus and submenus
        angular.forEach($scope.menus, function (menu) {
          angular.forEach(menu.submenu, function (submenu) {
            angular.forEach($scope.form.permissions, function (permission) {
              if (permission.name === submenu.permissionName && permission.status) {
                submenu.permission = true;
              }
            });
          });

          angular.forEach($scope.form.permissions, function (permission) {
            if (permission.name === menu.permissionName && permission.status) {
              menu.permission = true;
            }
          });
        });

        // Check and set permissions for common permissions
        angular.forEach($scope.userCommon, function (common) {
          angular.forEach($scope.form.permissions, function (permission) {
            if (permission.name === common.permissionName && permission.status) {
              common.permission = true;
            }
          });
        });
      }

      $("#permissionTable").modal("show");
      showHideLoad(true);
    }



    $scope.saveUser = function () {
      showHideLoad();
      if ($scope.form.id == "" || $scope.form.id == undefined) {
        var method = "POST";
        var url = "api/v1/postUser";
      } else {
        var method = "PUT";
        var url = "api/v1/putUser";
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
      $("#permissionTable").modal("hide");
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
        method: "DELETE",
        params: { id: id },
        url: "api/v1/deleteUser",
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
        url: "api/v1/usernameAvailability",
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
        url: "api/v1/emailAvailability",
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


    $scope.companyPermission = [
      {
        "menu": "Dashboard",
        "submenu": [],
        "permissionName": "DASHBOARD",
        "permission": true

      },
      {
        "menu": "Plant Master",
        "submenu": [],
        "permissionName": "PLANTMASTER",
        "permission": false

      },
      {
        "menu": "User Registration",
        "submenu": [],
        "permissionName": "USERREGISTRATION",
        "permission": false
      },
      {
        "menu": "Common Master",
        "submenu": [
          {
            "name": "Item Type",
            "permissionName": "ITEMTYPE",
            "permission": false
          },
          {
            "name": "Unit",
            "permissionName": "UNIT",
            "permission": false
          },
          {
            "name": "Vehicle",
            "permissionName": "VEHICLE",
            "permission": false
          }
        ],
        "permissionName": "COMMONMASTER",
        "permission": false
      },
      {
        "menu": "Item",
        "submenu": [],
        "permissionName": "ITEM",
        "permission": false
      },
      {
        "menu": "Vendor",
        "submenu": [],
        "permissionName": "VENDOR",
        "permission": false
      },
      {
        "menu": "Weighing Charges",
        "submenu": [],
        "permissionName": "WEIGHINGCHARGES",
        "permission": false
      }
    ];


    $scope.plantPermission = [
      {
        "menu": "Dashboard",
        "submenu": [],
        "permissionName": "DASHBOARD",
        "permission": true

      },
      {
        "menu": "Token Generation",
        "submenu": [],
        "permissionName": "TOKENGENERATION",
        "permission": false

      },
      {
        "menu": "Weighing",
        "submenu": [
          {
            "name": "Gross Weight",
            "permissionName": "GROSSWEIGHT",
            "permission": false
          },
          {
            "name": "Quality Check",
            "permissionName": "QUALITYCHECK",
            "permission": false
          },
          {
            "name": "Tare Weight",
            "permissionName": "TAREWEIGHT",
            "permission": false
          }
        ],
        "permissionName": "WEIGHING",
        "permission": false
      },
      {
        "menu": "Billing",
        "submenu": [
          {
            "name": "Bill Generation",
            "permissionName": "BILLGENERATION",
            "permission": false
          },
          {
            "name": "Bill Payment",
            "permissionName": "BILLPAYMENT",
            "permission": false
          },
          {
            "name": "Hold Bill Payment",
            "permissionName": "HOLDBILLPAYMENT",
            "permission": false
          },
          {
            "name": "Paid Bill",
            "permissionName": "PAIDBILL",
            "permission": false
          }
        ],
        "permissionName": "BILLING",
        "permission": false
      },
      {
        "menu": "Report",
        "submenu": [],
        "permissionName": "REPORT",
        "permission": false
      },
      {
        "menu": "Contract Form",
        "submenu": [],
        "permissionName": "CONTRACTFORM",
        "permission": false
      },
      {
        "menu": "Common Master",
        "submenu": [
          {
            "name": "Weigh Bridge",
            "permissionName": "WEIGHBRIDGE",
            "permission": false
          },
          {
            "name": "Uploading Point",
            "permissionName": "UPLOADINGPOINT",
            "permission": false
          }
        ],
        "permissionName": "COMMONMASTER",
        "permission": false
      }
    ];


    $scope.commonPermission = [
      {
        "name": "Add",
        "permissionName": "ADD",
        "permission": false

      },
      {
        "name": "Edit",
        "permissionName": "EDIT",
        "permission": false

      },
      // {
      //   "name": "Delete",
      //   "permissionName": "DELETE",
      //   "permission": false
      // },
      {
        "name": "Print",
        "permissionName": "PRINT",
        "permission": false
      }
    ];








  });
