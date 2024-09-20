angular
  .module("Application").controller("ItemTypeController", function ($scope, $http, $timeout, DTOptionsBuilder) {
    $scope.form = {};
    $scope.views = {};
    $scope.views.list = true;
    $scope.dtOptions = DTOptionsBuilder.newOptions()
      .withOption("stateSave", true) // Enable state saving
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
              extend: "copy",
              text: '<span class="icon-common icon-dropdown-action icon-copy"></span><span class="lbl-dropdown-action">Copy</span>', // Icon for Copy
              className: "btn btn-default",
              title: "Department",
              exportOptions: {
                columns: ":not(:last-child)", // Exclude the last column
                modifier: {
                  page: "current",
                },
              },
            },
            {
              extend: "excel",
              text: '<span class="icon-common icon-dropdown-action icon-excel"></span><span class="lbl-dropdown-action">Excel</span>', // Icon for Excel
              className: "btn btn-success",
              title: "Department",
              exportOptions: {
                columns: ":not(:last-child)", // Exclude the last column
                modifier: {
                  page: "current",
                },
                header: false, // Exclude the header row
              },
            },
            {
              extend: "pdf",
              text: '<span class="icon-common icon-dropdown-action icon-pdf"></span><span class="lbl-dropdown-action">PDF</span>', // Icon for PDF
              className: "btn btn-danger",
              title: "Department",
              exportOptions: {
                columns: ":not(:last-child)", // Exclude the last column
                modifier: {
                  page: "current",
                },
              },
            },
            {
              extend: "print",
              text: '<span class="icon-common icon-dropdown-action icon-print"></span><span class="lbl-dropdown-action">Print</span>',
              autoPrint: true,
              exportOptions: {
                columns: ":not(:last-child)", // Exclude the last column
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

    autoItemTypeListFetch();
    function autoItemTypeListFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/itemType/getAllItemType",
      }).then(
        function successCallback(response) {
          //console.log(response);
          $scope.itemTypes = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.AddItemType = function () {
      $scope.form = {};
      $("#add_edit_dept_modal").modal("show");
    };

    $scope.addEditSaveItemType = function () {
      //console.log($scope.form);
      showHideLoad();
      if ($scope.form.id == "" || $scope.form.id == undefined) {
        var method = "POST";
        var url = "api/v1/itemType/createItemType";
      } else {
        var method = "PUT";
        var url = "api/v1/itemType/updateItemType";
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
      autoItemTypeListFetch();
      $("#add_edit_dept_modal").modal("hide");
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
    $scope.editItemTypes = function (id) {
      showHideLoad();
      $http({
        method: "GET",
        params: { id: id },
        url: "api/v1/itemType/getItemTypeById",
      }).then(
        function successCallback(response) {
          //console.log(response.data);
          $scope.form = response.data;
          $("#add_edit_dept_modal").modal("show");
          showHideLoad(true);
        },
        function errorCallback(response) {
          //console.log(response.statusText);
        }
      );
    };

    $scope.changeStatus = function (id) {
      showHideLoad();
      $http({
        method: "DELETE",
        params: { id: id },
        url: "api/v1/itemType/toggleItemTypeStatus",
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(
        function successCallback(response) {
          showHideLoad(true);
        },
        function errorCallback(response) {
          //console.log(response.statusText);
        }
      );
    };
    $scope.changeView = function (view) {
      if (view == "add" || view == "list" || view == "show") {
        $scope.form = {};
      }
      $scope.views.add = false;
      $scope.views.edit = false;
      $scope.views.list = false;
      $scope.views[view] = true;
    };
  }
  )

  .controller("UnitController", function ($scope, $http, $timeout, DTOptionsBuilder) {
    $scope.form = {};
    $scope.views = {};
    $scope.views.list = true;
    $scope.dtOptions = DTOptionsBuilder.newOptions()
      .withOption("stateSave", true) // Enable state saving
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
              extend: "copy",
              text: '<span class="icon-common icon-dropdown-action icon-copy"></span><span class="lbl-dropdown-action">Copy</span>', // Icon for Copy
              className: "btn btn-default",
              title: "Department",
              exportOptions: {
                columns: ":not(:last-child)", // Exclude the last column
                modifier: {
                  page: "current",
                },
              },
            },
            {
              extend: "excel",
              text: '<span class="icon-common icon-dropdown-action icon-excel"></span><span class="lbl-dropdown-action">Excel</span>', // Icon for Excel
              className: "btn btn-success",
              title: "Department",
              exportOptions: {
                columns: ":not(:last-child)", // Exclude the last column
                modifier: {
                  page: "current",
                },
                header: false, // Exclude the header row
              },
            },
            {
              extend: "pdf",
              text: '<span class="icon-common icon-dropdown-action icon-pdf"></span><span class="lbl-dropdown-action">PDF</span>', // Icon for PDF
              className: "btn btn-danger",
              title: "Department",
              exportOptions: {
                columns: ":not(:last-child)", // Exclude the last column
                modifier: {
                  page: "current",
                },
              },
            },
            {
              extend: "print",
              text: '<span class="icon-common icon-dropdown-action icon-print"></span><span class="lbl-dropdown-action">Print</span>',
              autoPrint: true,
              exportOptions: {
                columns: ":not(:last-child)", // Exclude the last column
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

    autoUnitListFetch();
    function autoUnitListFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/UnitMaster/getAllUnitMaster",
      }).then(
        function successCallback(response) {
          //console.log(response);
          $scope.units = response.data;
          // $scope.changeView("list");
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.AddUnit = function () {
      $scope.form = {};
      $("#add_edit_dept_modal").modal("show");
    };

    $scope.addEditSaveUnit = function () {
      //console.log($scope.form);
      showHideLoad();
      if ($scope.form.id == "" || $scope.form.id == undefined) {
        var method = "POST";
        var url = "api/v1/UnitMaster/createUnitMaster";
      } else {
        var method = "PUT";
        var url = "api/v1/UnitMaster/updateUnitMaster";
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
      autoUnitListFetch();
      $("#add_edit_dept_modal").modal("hide");
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
    $scope.editUnit = function (id) {
      showHideLoad();
      $http({
        method: "GET",
        params: { id: id },
        url: "api/v1/UnitMaster/getUnitMasterById",
      }).then(
        function successCallback(response) {
          //console.log(response.data);
          $scope.form = response.data;
          $("#add_edit_dept_modal").modal("show");
          showHideLoad(true);
        },
        function errorCallback(response) {
          //console.log(response.statusText);
        }
      );
    };

    $scope.changeStatus = function (id) {
      showHideLoad();
      $http({
        method: "DELETE",
        params: { id: id },
        url: "api/v1/UnitMaster/toggleUnitMasterStatus",
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(
        function successCallback(response) {
          //console.log(response.data);
          showHideLoad(true);
        },
        function errorCallback(response) {
          //console.log(response.statusText);
        }
      );
    };

    $scope.changeView = function (view) {
      if (view == "add" || view == "list" || view == "show") {
        $scope.form = {};
      }
      $scope.views.add = false;
      $scope.views.edit = false;
      $scope.views.list = false;
      $scope.views[view] = true;
    };
  }
  )

  .controller("VehicleController", function ($scope, $http, $timeout, DTOptionsBuilder) {
    $scope.form = {};
    $scope.views = {};
    $scope.views.list = true;
    $scope.dtOptions = DTOptionsBuilder.newOptions()
      .withOption("stateSave", true) // Enable state saving
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
              extend: "copy",
              text: '<span class="icon-common icon-dropdown-action icon-copy"></span><span class="lbl-dropdown-action">Copy</span>', // Icon for Copy
              className: "btn btn-default",
              title: "Department",
              exportOptions: {
                columns: ":not(:last-child)", // Exclude the last column
                modifier: {
                  page: "current",
                },
              },
            },
            {
              extend: "excel",
              text: '<span class="icon-common icon-dropdown-action icon-excel"></span><span class="lbl-dropdown-action">Excel</span>', // Icon for Excel
              className: "btn btn-success",
              title: "Department",
              exportOptions: {
                columns: ":not(:last-child)", // Exclude the last column
                modifier: {
                  page: "current",
                },
                header: false, // Exclude the header row
              },
            },
            {
              extend: "pdf",
              text: '<span class="icon-common icon-dropdown-action icon-pdf"></span><span class="lbl-dropdown-action">PDF</span>', // Icon for PDF
              className: "btn btn-danger",
              title: "Department",
              exportOptions: {
                columns: ":not(:last-child)", // Exclude the last column
                modifier: {
                  page: "current",
                },
              },
            },
            {
              extend: "print",
              text: '<span class="icon-common icon-dropdown-action icon-print"></span><span class="lbl-dropdown-action">Print</span>',
              autoPrint: true,
              exportOptions: {
                columns: ":not(:last-child)", // Exclude the last column
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

    autoVehicleListFetch();
    function autoVehicleListFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/VehicleMaster/getAllVehicleMaster",
      }).then(
        function successCallback(response) {
          //console.log(response);
          $scope.vehicles = response.data;
          $scope.changeView("list");
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.AddVehicle = function () {
      $scope.form = {};
      $("#add_edit_dept_modal").modal("show");
    };

    $scope.addEditSaveVehicle = function () {
      //console.log($scope.form);
      showHideLoad();
      if ($scope.form.id == "" || $scope.form.id == undefined) {
        var method = "POST";
        var url = "api/v1/VehicleMaster/createVehicleMaster";
      } else {
        var method = "PUT";
        var url = "api/v1/VehicleMaster/updateVehicleMaster";
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
      autoVehicleListFetch();
      $("#add_edit_dept_modal").modal("hide");
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
    $scope.editVehicle = function (id) {
      showHideLoad();
      $http({
        method: "GET",
        params: { id: id },
        url: "api/v1/VehicleMaster/getVehicleMasterById",
      }).then(
        function successCallback(response) {
          //console.log(response.data);
          $scope.form = response.data;
          $("#add_edit_dept_modal").modal("show");
          showHideLoad(true);
        },
        function errorCallback(response) {
          //console.log(response.statusText);
        }
      );
    };

    $scope.changeStatus = function (id) {
      showHideLoad();
      $http({
        method: "DELETE",
        params: { id: id },
        url: "api/v1/VehicleMaster/toggleVehicleMasterStatus",
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(
        function successCallback(response) {
          showHideLoad(true);
        },
        function errorCallback(response) {
          //console.log(response.statusText);
        }
      );
    };

    $scope.changeView = function (view) {
      if (view == "add" || view == "list" || view == "show") {
        $scope.form = {};
      }
      $scope.views.add = false;
      $scope.views.edit = false;
      $scope.views.list = false;
      $scope.views[view] = true;
    };
  }
  )

  .controller("VendorController", function ($scope, $http, $timeout, DTOptionsBuilder, $q) {
    $scope.form = {};
    $scope.views = {};
    $scope.countries = {};
    $scope.states = {};
    $scope.views.list = true;

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
                columns: ":not(:last-child)", // Exclude the last column
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
                columns: ":not(:last-child)", // Exclude the last column
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

    autoVendorListFetch();
    function autoVendorListFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/vendor/getAllVendors",
      }).then(
        function successCallback(response) {
          console.log(response);
          $scope.vendors = response.data;
          $scope.changeView("list");
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.fetchStates = function () {
      return $q(function (resolve, reject) {
        $scope.states = {};
        showHideLoad();
        $http({
          method: "GET",
          url: "api/v1/common/getState",
        }).then(
          function successCallback(response) {
            $scope.states = response.data;
            showHideLoad(true);
            resolve();
          },
          function errorCallback(response) {
            console.log(response.statusText);
            reject(response.statusText);
          }
        );
      });
    };

    $scope.fetchCountry = function () {
      return $q(function (resolve, reject) {
        $scope.countries = {};
        showHideLoad();
        $http({
          method: "GET",
          url: "api/v1/common/getCountry",
        }).then(
          function successCallback(response) {
            $scope.countries = response.data;
            showHideLoad(true);
            resolve();
          },
          function errorCallback(response) {
            console.log(response.statusText);
            reject(response.statusText);
          }
        );
      });
    };

    $scope.AddVendors = function () {
      showHideLoad();
      $q.all([$scope.fetchStates(), $scope.fetchCountry()]).then(function () {
        $scope.form = {}; // Initialize form to a new object
        $("#add_edit_vendor_modal").modal("show");
        showHideLoad(true);
      });
    };

    $scope.editVendor = function (data) {
      showHideLoad();
      $q.all([$scope.fetchStates(), $scope.fetchCountry()]).then(function () {
        $scope.form = angular.copy(data); // Use angular.copy to avoid direct binding
        $("#add_edit_vendor_modal").modal("show");
        showHideLoad(true);
      });
    };


    $scope.close = function () {
      $scope.form = {};
      $("#add_edit_vendor_modal").modal("hide");
    }

    $scope.saveVendor = function () {
      showHideLoad();
      if ($scope.form.id == "" || $scope.form.id == undefined) {
        var method = "POST";
        var url = "api/v1/vendor/createVendor";
      } else {
        var method = "PUT";
        var url = "api/v1/vendor/updateVendor";
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
      $("#add_edit_vendor_modal").modal("hide");
      autoVendorListFetch();
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

    $scope.changeToggleVendor = function (id) {
      showHideLoad();
      $http({
        method: "DELETE",
        params: { id: id },
        url: "api/v1/vendor/deleteVendor",
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(
        function successCallback(response) {
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    };

    $scope.changeView = function (view) {
      if (view == "add" || view == "list" || view == "show") {
        $scope.form = {};
      }
      $scope.views.add = false;
      $scope.views.edit = false;
      $scope.views.list = false;
      $scope.views[view] = true;
    };
  }
  )

  .controller("ItemController", function ($scope, $http, $timeout, DTOptionsBuilder, $q) {
    $scope.form = {};
    $scope.views = {};
    $scope.views.list = true;

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
                columns: ":not(:last-child)", // Exclude the last column
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
                columns: ":not(:last-child)", // Exclude the last column
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

    autoItemFetch();
    function autoItemFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/item/getAllItem",
      }).then(
        function successCallback(response) {
          $scope.items = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }


    $scope.getPriceHistory = function (id,name) {
      showHideLoad();
      $http({
        method: "GET",
        params: { id: id },
        url: "api/v1/item/getItemPriceHistoryById",
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(
        function successCallback(response) {
          console.log(response);
          $scope.priceHistoryList = JSON.parse(response.data);
          $scope.priceHistoryName = name;
          $("#price_history").modal("show");
          showHideLoad(true);
        },
        function errorCallback(response) {
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
      );
    };

    $scope.AddItem = function () {
      showHideLoad();
      $q.all([$scope.getItemType(), $scope.getUnits()]).then(function () {
        $scope.form = {}; // Initialize form to a new object
        $("#add_edit_user_modal").modal("show");
        showHideLoad(true);
      });
    };

    $scope.getItemType = function () {
      return $q(function (resolve, reject) {
        $scope.itemTypes = {};
        showHideLoad();
        $http({
          method: "GET",
          url: "api/v1/itemType/getItemTypes",
        }).then(
          function successCallback(response) {
            $scope.itemTypes = response.data;
            showHideLoad(true);
            resolve();
          },
          function errorCallback(response) {
            console.log(response.statusText);
            reject(response.statusText);
          }
        );
      });
    };

    $scope.getUnits = function () {
      return $q(function (resolve, reject) {
        $scope.units = {};
        showHideLoad();
        $http({
          url: "api/v1/UnitMaster/getUnitMasters",
        }).then(
          function successCallback(response) {
            $scope.units = response.data;
            showHideLoad(true);
            resolve();
          },
          function errorCallback(response) {
            console.log(response.statusText);
            reject(response.statusText);
          }
        );
      });
    };

    $scope.editItem = function (item) {
      showHideLoad();
      $q.all([$scope.getItemType(), $scope.getUnits()]).then(function () {
        $scope.form = angular.copy(item); // Use angular.copy to avoid direct binding
        $scope.form.oldRate = item.rate;
        $("#add_edit_user_modal").modal("show");
        showHideLoad(true);
      });
    };

    $scope.close = function () {
      $scope.form = {};
      $("#add_edit_user_modal").modal("hide");
    };

    $scope.saveItem = function () {
      showHideLoad();
      if ($scope.form.id == "" || $scope.form.id == undefined) {
        var method = "POST";
        var url = "api/v1/item/createItem";
      } else {
        var method = "PUT";
        var url = "api/v1/item/updateItem";
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
      autoItemFetch();
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
        url: "api/v1/item/toggleItemStatus",
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(
        function successCallback(response) {
          showHideLoad(true);
        },
        function errorCallback(response) {
          //console.log(response.statusText);
        }
      );
    };

  })

  .controller("WeighingChargesController", function ($scope, $http, $timeout, DTOptionsBuilder) {
    $scope.form = {};
    $scope.views = {};
    $scope.views.list = true;

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
                columns: ":not(:last-child)", // Exclude the last column
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
                columns: ":not(:last-child)", // Exclude the last column
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

    autoFetchWeighingCharges();
    function autoFetchWeighingCharges() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/weighingCharges/getAllWeighingCharges",
      }).then(
        function successCallback(response) {
          $scope.charges = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.AddData = function () {
      $scope.form = {};
      $scope.getVehicleMaster();
      $("#add_edit_dept_modal").modal("show");
    };

    $scope.getVehicleMaster = function () {
      $scope.vehicles = {};
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/VehicleMaster/getAllVehicleMaster",
      }).then(
        function successCallback(response) {
          //console.log(response);
          $scope.vehicles = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.editData = function (data) {
      showHideLoad();
      $scope.form = {};
      $scope.getVehicleMaster();
      $scope.form = data;
      $("#add_edit_dept_modal").modal("show");
      showHideLoad(true);
    };

    $scope.saveData = function () {
      showHideLoad();
      if ($scope.form.id == "" || $scope.form.id == undefined) {
        var method = "POST";
        var url = "api/v1/weighingCharges/createWeighingCharges";
      } else {
        var method = "PUT";
        var url = "api/v1/weighingCharges/updateWeighingCharges";
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
      $("#add_edit_dept_modal").modal("hide");
      autoFetchWeighingCharges();
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
        url: "api/v1/weighingCharges/toggleWeighingChargesStatus",
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(
        function successCallback(response) {
          showHideLoad(true);
          console.log(response.statusText);
        },
        function errorCallback(response) {
          showHideLoad(true);
          console.log(response.statusText);
        }
      );
    };
  }
  );
