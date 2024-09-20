angular
  .module("Application")

  .controller("WeighBridgeController", function ($scope, $http, $timeout, DTOptionsBuilder) {
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

    autoWeighBridgesFetch();
    function autoWeighBridgesFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/weighBridge/getAllWeighBridge ",
      }).then(
        function successCallback(response) {
          $scope.weighBridges = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.AddWeighBridges = function () {
      $scope.form = {};
      $("#add_edit_WeighBridges_modal").modal("show");
    };

    $scope.editWeighBridges = function (bridge) {
      $scope.form = {};
      showHideLoad();
      $scope.form = bridge;
      $("#add_edit_WeighBridges_modal").modal("show");
      showHideLoad(true);
    };

    $scope.close = function () {
      $scope.form = {};
      $("#add_edit_WeighBridges_modal").modal("hide");
    }

    $scope.addEditSaveWeighBridges = function () {
      showHideLoad();
      if ($scope.form.id == "" || $scope.form.id == undefined) {
        var method = "POST";
        var url = "api/v1/weighBridge/createWeighBridge";
      } else {
        var method = "PUT";
        var url = "api/v1/weighBridge/updateWeighBridge";
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
      $("#add_edit_WeighBridges_modal").modal("hide");
      autoWeighBridgesFetch();
      Toastify({
        text: response.data,
        duration: 1000,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
      // Swal.fire({
      //   text: response.data,
      //   icon: "success",
      //   buttonsStyling: !1,
      //   confirmButtonText: "Ok, got it!",
      //   customClass: {
      //     confirmButton: "btn btn-primary",
      //   },
      // });
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
        url: "api/v1/weighBridge/toggleWeighBridgeStatus",
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(
        function successCallback(response) {
          //console.log(response.data);
          // autoUserListFetch();
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
      $scope.views.show = false;
      $scope.views.list = false;
      $scope.views[view] = true;
    };
  }
  )

  .controller("UnloadingPointController", function ($scope, $http, $timeout, DTOptionsBuilder) {
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

    autoUnloadingPointsFetch();
    function autoUnloadingPointsFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/unloadingPoint/getAllUnloadingPoint ",
      }).then(
        function successCallback(response) {
          $scope.unloadingPoints = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.AddUnloadingPoints = function () {
      $scope.form = {};
      $("#add_edit_UnloadingPoints_modal").modal("show");
    };

    $scope.editUnloadingPoints = function (bridge) {
      $scope.form = {};
      showHideLoad();
      $scope.form = bridge;
      $("#add_edit_UnloadingPoints_modal").modal("show");
      showHideLoad(true);
    };

    $scope.close = function () {
      $scope.form = {};
      $("#add_edit_UnloadingPoints_modal").modal("hide");
    }

    $scope.addEditSaveUnloadingPoints = function () {
      showHideLoad();
      if ($scope.form.id == "" || $scope.form.id == undefined) {
        var method = "POST";
        var url = "api/v1/unloadingPoint/createUnloadingPoint";
      } else {
        var method = "PUT";
        var url = "api/v1/unloadingPoint/updateUnloadingPoint";
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
      $("#add_edit_UnloadingPoints_modal").modal("hide");
      autoUnloadingPointsFetch();
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
        url: "api/v1/unloadingPoint/toggleUnloadingPointStatus",
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(
        function successCallback(response) {
          //console.log(response.data);
          // autoUserListFetch();
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
      $scope.views.show = false;
      $scope.views.list = false;
      $scope.views[view] = true;
    };
  }
  )

  .controller("ContractFormController", function ($scope, $http, $timeout, DTOptionsBuilder) {
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

    autoContractFetch();
    function autoContractFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/contract/getContracts ",
      }).then(
        function successCallback(response) {
          $scope.contracts = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.AddContract = function () {
      $scope.form = {};
      $scope.getVendors();
      $scope.getItemType();
      $("#add_edit_contract_modal").modal("show");
    };


    $scope.close = function () {
      $scope.form = {};
      $("#add_edit_contract_modal").modal("hide");
    }

    $scope.getVendors = function () {
      $scope.vendors = {};
      showHideLoad();
      $http({
        method: "GET",
        params: { type: 'Contractor' },
        url: "api/v1/vendor/getVendorsByType",
      }).then(
        function successCallback(response) {
          $scope.vendors = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    };

    $scope.getItemType = function () {
      $scope.itemTypes = {};
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/itemType/getAllItemType",
      }).then(
        function successCallback(response) {
          //console.log(response);
          $scope.itemTypes = response.data;
          $scope.items = {};
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    };

    $scope.selectVendor = function (id) {
      $scope.vendorData = {};
      let yourDate = new Date();
      let current_date = yourDate.toISOString().split("T")[0];
      angular.forEach($scope.vendors, function (val, key) {
        if (val.id === id) {
          $scope.vendorData = val;
          $scope.form.vendorName = val.name;
          $scope.form.date = current_date;
          console.log($scope.vendorData);
          return;
        }
      });
    };

    $scope.findItem = function (type) {
      $scope.items = {};
      showHideLoad();
      $http({
        method: "GET",
        params: { type: type },
        url: "api/v1/item/getItemsByItemType",
      }).then(
        function successCallback(response) {
          console.log(response.data);
          $scope.items = response.data;
          console.log($scope.items);
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    };

    $scope.getItemData = function (item) {
      angular.forEach($scope.items, function (val, key) {
        if (val.name === item) {
          $scope.form.unit = val.unit;
          $scope.form.rate = val.rate;
          $scope.form.dust = val.dust;
          $scope.form.moist = val.moist;
          $scope.form.itemId = val.id;
          $scope.form.type = 'FIXED';
          $scope.form.freight = 0.00;
          $scope.form.cheeping = 0.00;
          $scope.form.loadAmount = 0.00;
          $scope.form.hold = 0.00;
          $scope.form.weight = 0.00;
          return;
        }
      });
    };

    $scope.$watchGroup(
      ["form.rate", "form.quantity"],
      function (newValues, oldValues, scope) {
        var rate = newValues[0];
        var quantity = newValues[1];
        if (rate != null && quantity != null) {
          $scope.form.amount = (rate * quantity).toFixed(2);
        } else {
          $scope.form.amount = 0;
        }
      }
    );

    $scope.getCompany = function () {
      $scope.companies = {};
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/company/getAllCompanies",
      }).then(
        function successCallback(response) {
          $scope.companies = response.data;
          console.log($scope.companies);
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    };

    $scope.editContract = function (contract) {
      showHideLoad();
      $scope.form = contract;
      $("#add_edit_contract_modal").modal("show");
      showHideLoad(true);
    };

    $scope.saveContract = function () {
      showHideLoad();
      if ($scope.form.id == "" || $scope.form.id == undefined) {
        var method = "POST";
        var url = "api/v1/contract/createContract";
      } else {
        var method = "PUT";
        var url = "api/v1/contract/updateContract";
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
      $("#add_edit_contract_modal").modal("hide");
      autoContractFetch();
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
        url: "api/v1/contract/toggleContractStatus",
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(
        function successCallback(response) {
          //console.log(response.data);
          // autoUserListFetch();
          showHideLoad(true);
        },
        function errorCallback(response) {
          //console.log(response.statusText);
        }
      );
    };
  }
  )

  .controller("TokenController", function ($scope, $http, $timeout, DTOptionsBuilder, $q) {
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

    autoTokenFetch();
    function autoTokenFetch() {
      var newDate = getFormattedDate()
      showHideLoad();
      $http({
        method: "GET",
        params: { startDate: newDate, endDate: newDate },
        url: "api/v1/token/getTokensForSearch",
      }).then(
        function successCallback(response) {
          $scope.tokens = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    function getFormattedDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns month from 0 to 11
      const day = ('0' + date.getDate()).slice(-2);

      return `${year}-${month}-${day}`;
    }

    $scope.searchToken = function () {
      showHideLoad();
      $http({
        method: "GET",
        params: { startDate: $scope.searchForm.startDate, endDate: $scope.searchForm.endDate },
        url: "api/v1/token/getTokensForSearch",
      }).then(
        function successCallback(response) {
          $scope.tokens = response.data;
          $("#search_modal").modal("hide");
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }


    $scope.viewPicture = function (image) {
      $scope.unloadingPicture = image;
      $("#picture_preview_modal").modal("show");
    };

    $scope.AddToken = function () {
      $scope.form = {};
      $scope.getVehicle();
      $("#add_edit_token_modal").modal("show");
    };

    $scope.editToken = function (token) {
      showHideLoad();
      $scope.form = token;
      $scope.form.getFullItemName = $scope.form.itemType + '-' + $scope.form.item;;
      $("#add_edit_token_modal").modal("show");
      showHideLoad(true);
    };

    $scope.close = function () {
      $scope.form = {};
      $scope.searchForm = {};
      $("#gross_weight_modal").modal("hide");
      $("#search_modal").modal("hide");
    }

    $scope.search = function () {
      $scope.searchForm = {};
      $("#search_modal").modal("show");
    }

    $scope.getVehicle = function () {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/VehicleMaster/getVehicleMasters",
      }).then(
        function successCallback(response) {
          console.log(response);
          $scope.vehicles = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    };

    $scope.getVendor = function (type) {
      $scope.form = {};
      $scope.vendors = {};
      $scope.form.vendorType = type;
      showHideLoad();
      $http({
        method: "GET",
        params: { type: type },
        url: "api/v1/vendor/getVendorsByType",
      }).then(
        function successCallback(response) {
          $scope.vendors = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    };

    $scope.selectData = function (id) {
      angular.forEach($scope.vendors, function (val, key) {
        if (val.id === id) {
          $scope.form.vendorName = val.name;
          $scope.form.pan = val.pan;
          $scope.form.aadhaar = val.aadhaar;
          $scope.form.bank = val.bank;
          $scope.form.branch = val.branch;
          $scope.form.accountName = val.accountName;
          $scope.form.accountNo = val.accountNo;
          $scope.form.ifsc = val.ifsc;
          $scope.form.mmid = val.mmid;
          return;
        }
      });
    };


    $scope.getItem = function (type, vendorId) {
      $scope.itemTypes = {};
      $scope.items = {};
      showHideLoad();
      if (type === "Contractor") {
        var url = "api/v1/contract/getContractsByVendorId";
      } else {
        var url = "api/v1/item/getItems";
      }
      $http({
        method: "GET",
        params: { id: vendorId },
        url: url,
      }).then(
        function successCallback(response) {
          console.log(response.data)
          $scope.itemData = response.data;
          $scope.form.chipper = 0.00;
          $scope.form.loadingFee = 0.00;
          $scope.form.freightFee = 0.00;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    };


    $scope.getContactDeData = function (id) {
      $scope.selectedItem = $scope.itemData.find(item => item.id === id) || null;
      if ($scope.selectedItem !== null) {
        $scope.form.itemType = $scope.selectedItem.itemType
        $scope.form.itemId = $scope.selectedItem.itemId
        $scope.form.item = $scope.selectedItem.item
        $scope.form.unit = $scope.selectedItem.unit
        $scope.form.rate = $scope.selectedItem.rate
        $scope.form.chipper = $scope.selectedItem.cheeping;
        $scope.form.freightFee = $scope.selectedItem.freight;
        $scope.form.loadingFee = $scope.selectedItem.loadAmount;
      }
    };
    $scope.getItemData = function (id) {
      $scope.selectedItem = $scope.itemData.find(item => item.id === id) || null;
      if ($scope.selectedItem !== null) {
        $scope.form.itemType = $scope.selectedItem.type
        $scope.form.item = $scope.selectedItem.name
        $scope.form.unit = $scope.selectedItem.unit
        $scope.form.rate = $scope.selectedItem.rate
      }
    };

    $scope.saveToken = function () {
      showHideLoad();
      if ($scope.form.id == "" || $scope.form.id == undefined) {
        var method = "POST";
        var url = "api/v1/token/createToken";
      } else {
        var method = "PUT";
        var url = "api/v1/token/updateToken";
      }
      $http({
        method: method,
        url: url,
        data: angular.toJson($scope.form),
      }).then(_success, _error);
    };

    function _success(response) {
      // console.log(response.data);
      showHideLoad(true);
      autoTokenFetch();
      $("#add_edit_token_modal").modal("hide");
      if (response.data.type == 'add') {
        Swal.fire({
          text: response.data.message,
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            // Call the function with the token ID when "Ok, got it!" is clicked
            $scope.tokenPrint(response.data.tokenId, 'token');
          }
        });

      }
      else {
        Swal.fire({
          text: response.data.message,
          icon: "success",
          buttonsStyling: !1,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      }
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
        url: "api/v1/token/toggleTokenStatus",
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(
        function successCallback(response) {
          //console.log(response.data);
          // autoUserListFetch();
          showHideLoad(true);
        },
        function errorCallback(response) {
          //console.log(response.statusText);
        }
      );
    };


    // $scope.tokenPrint = function (id, type) {
    //   document.getElementById("barcode").innerHTML = "";
    //   showHideLoad();
    //   $http({
    //     method: "GET",
    //     params: { id: id },
    //     url: "api/v1/token/getTokenForPrint",
    //   }).then(
    //     function successCallback(response) {
    //       console.log(response.data);
    //       $scope.printData = response.data;
    //       JsBarcode("#barcode", response.data.token.tokenNumber, {
    //         format: "CODE39",
    //         width: 1,
    //         height: 50,
    //         displayValue: false,
    //       });

    //       var canvas = document.getElementById('barcode');
    //       barcodeImage = new Image();
    //       barcodeImage.src = canvas.toDataURL('image/png');
    //       $scope.imageBarCode = barcodeImage.src

    //       console.log(barcodeImage.src);

    //       if (type === 'G') {
    //         $("#print_modal_gross_weight").modal("show");
    //       } else if (type === 'QC') {
    //         $("#print_modal_QC").modal("show");
    //       } else if (type === 'GRN') {
    //         $("#print_modal_tare_weight").modal("show");
    //       } else {
    //         $("#print_modal").modal("show");
    //       }

    //       showHideLoad(true);
    //     },
    //     function errorCallback(response) {
    //       //console.log(response.statusText);
    //     }
    //   );
    // };

    $scope.tokenPrint = function (id, type) {
      document.getElementById("barcode").innerHTML = "";
      showHideLoad();

      $http.get("api/v1/token/getTokenForPrint", { params: { id: id } }).then(
        function successCallback(response) {
          console.log(response.data);
          $scope.printData = response.data;

          // Function to generate barcode and return image source
          function generateBarcode(selector, value) {
            JsBarcode(selector, value, {
              format: "CODE39",
              width: 1,
              height: 50,
              displayValue: true,
            });
            const canvas = document.querySelector(selector);
            const barcodeImage = new Image();
            barcodeImage.src = canvas.toDataURL("image/png");
            return barcodeImage.src;
          }

          $scope.imageBarCode = generateBarcode("#barcode", response.data.token.tokenNumber);

          // Generate second barcode only if type is 'G'
          if (type === "G") {
            $scope.imageBarCodeTrn = generateBarcode("#barcodeTrn", response.data.token.trnId);
          }

          // Determine which modal to show based on type
          const modalMapping = {
            G: "#print_modal_gross_weight",
            QC: "#print_modal_QC",
            GRN: "#print_modal_tare_weight",
          };
          $(modalMapping[type] || "#print_modal").modal("show");

          showHideLoad(true);
        },
        function errorCallback() {
          // Handle error if needed
        }
      );
    };

    $scope.changeView = function (view) {
      if (view == "add" || view == "list" || view == "show") {
        $scope.form = {};
      }
      $scope.views.add = false;
      $scope.views.show = false;
      $scope.views.list = false;
      $scope.views[view] = true;
    };
  }
  )

  .controller("GrossWeightController", function ($scope, $http, $timeout, DTOptionsBuilder, $q) {
    $scope.form = {};
    $scope.views = {};
    $scope.views.list = true;
    $scope.controlDisable = true;
    $scope.manualWeight = false;
    $scope.token = '';
    $scope.cameraUrl = '';
    $scope.capturedImage = '';
    $scope.url = '';

    let typingTimer; // Timer identifier
    const doneTypingInterval = 500; // Time in ms, 500ms example

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



    autoTokenFetch();
    function autoTokenFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/token/getTokensForGrossWeight ",
      }).then(
        function successCallback(response) {
          $scope.tokens = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }


    $scope.enterGrossToken = function () {
      showHideLoad();
      $q.all([$scope.getWeighBridge()]).then(function () {
        $scope.controlDisable = true;
        $scope.cameraDisable = true;
        $scope.manualWeight = false;
        $scope.token = '';
        $scope.url = '';
        $scope.cameraUrl = '';
        $scope.form = {};
        $("#gross_weight_modal").modal("show");
        showHideLoad(true);
      });
    };


    $scope.delayedGetToken = function (token) {
      // Clear the previous timer
      if (typingTimer) {
        $timeout.cancel(typingTimer);
      }

      // Start a new timer
      typingTimer = $timeout(function () {
        $scope.getToken(token);
      }, doneTypingInterval);
    };

    $scope.getToken = function (token) {
      if (token !== null || token !== undefined || token !== '') {
        $scope.controlDisable = true;
        $scope.form = {};
        showHideLoad();
        $http({
          method: "GET",
          params: { token: token },
          url: "api/v1/token/getTokenByTokenNumber",
        }).then(
          function successCallback(response) {
            showHideLoad(true);
            if (response.data.grossWeightStatus == true) {
              $("#gross_weight_modal").modal("hide");
              Swal.fire({
                text: "Already Done!",
                icon: "success"
              });
              return;
            }
            $scope.form = response.data;
            $scope.controlDisable = false;
            showHideLoad(true);
          },
          function errorCallback(response) {
            showHideLoad(true);
            console.log(response.statusText);
          }
        );
      }
    }


    $scope.getWeighBridge = function () {
      return $q(function (resolve, reject) {
        $scope.weighBridges = {};
        showHideLoad();
        $http({
          method: "GET",
          url: "api/v1/weighBridge/getWeighBridge ",
        }).then(
          function successCallback(response) {
            $scope.weighBridges = response.data;
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

    $scope.close = function () {
      $scope.form = {};
      $("#gross_weight_modal").modal("hide");
    }

    $scope.checkLocation = function (data) {
      $scope.url = ''
      $scope.cameraUrl = '';
      $scope.imageFile = '';
      $scope.capturedImage = '';
      $scope.form.grossWeightImageLink = '';
      $scope.cameraDisable = true;
      $scope.form.grossWeight = 0.00;
      const foundItem = $scope.weighBridges.find(bridge => bridge.code === data);
      $scope.form.grossWeightWeighBridge = foundItem.name;

      if (foundItem.cameraEnable === 'YES') {
        $scope.cameraDisable = false;
        $scope.url = foundItem.ip;
      }

      if (foundItem.manualStatus === 'YES') {
        $scope.manualWeight = true;
      }
      else {
        $scope.manualWeight = false;

      }
    }


    $scope.getWeight = function (site) {
      if (site === undefined || site === '' || site === null) {
        Swal.fire({
          text: 'Please Select  Weigh Bridge',
          icon: "error",
          buttonsStyling: !1,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
        return;
      }
      showHideLoad();
      $http({
        method: "GET",
        params: { site: site },
        url: "api/v1/weightData/getWeight",
      }).then(
        function successCallback(response) {
          console.log(response.data);
          $scope.form.grossWeight = response.data.weightData;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.saveToken = function () {
      if ($scope.controlDisable) {
        return;
      }
      else {
        if ($scope.form.grossWeight < $scope.form.minWeight) {
          Swal.fire({
            text: 'The gross weight must be greater than or equal to ' + $scope.form.minWeight + 'Kg',
            icon: "error",
            buttonsStyling: !1,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
          return;
        }
        // Handle form submission
        $http({
          method: "PUT",
          url: "api/v1/token/updateTokenFromGrossWeight",
          data: angular.toJson($scope.form),
          headers: {
            "Content-Type": "application/json",
          },
          transformResponse: angular.identity,
        }).then(_success, _error);
      }
    };

    function _success(response) {
      showHideLoad(true);
      $("#gross_weight_modal").modal("hide");
      autoTokenFetch();
      // Swal.fire({
      //   text: response.data,
      //   icon: "success",
      //   buttonsStyling: !1,
      //   confirmButtonText: "Ok, got it!",
      //   customClass: {
      //     confirmButton: "btn btn-primary",
      //   },
      // });
      $scope.tokenPrint(response.data);
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



    $scope.tokenPrint = function (id) {
      document.getElementById("barcode").innerHTML = "";
      document.getElementById("barcodeTrn").innerHTML = "";
      showHideLoad();
      $http({
        method: "GET",
        params: { id: id },
        url: "api/v1/token/getTokenForPrint",
      }).then(
        function successCallback(response) {
          console.log(response.data);
          $scope.printData = response.data;

          // Barcode generation function to avoid code duplication
          function generateBarcode(selector, value) {
            JsBarcode(selector, value, {
              format: "CODE39",
              width: 1,
              height: 50,
              displayValue: true,
            });
            const canvas = document.querySelector(selector);
            const barcodeImage = new Image();
            barcodeImage.src = canvas.toDataURL("image/png");
            return barcodeImage.src;
          }
          $scope.imageBarCode = generateBarcode("#barcode", response.data.token.tokenNumber);
          $scope.imageBarCodeTrn = generateBarcode("#barcodeTrn", response.data.token.trnId);
          $("#print_modal").modal("show");
          showHideLoad(true);
        },
        function errorCallback(response) {
          //console.log(response.statusText);
        }
      );
    };


    $scope.startCamera = function () {
      $scope.capturedImage = '';
      // Set the camera URL (replace with your actual camera feed URL)
      $scope.cameraUrl = $scope.url + '/video';
    };

    $scope.captureImage = function () {
      if (!$scope.cameraDisable) {
        const photoUrl = $scope.url + '/shot.jpg?' + new Date().getTime();
        $scope.capturedImage = photoUrl;
        $scope.cameraUrl = '';

        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = $scope.capturedImage;
        img.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          var capturedImageData = canvas.toDataURL('image/png');

          $scope.capturedImage = capturedImageData;
          $scope.imageFile = dataURItoBlob(capturedImageData);
          $scope.uploadFile($scope.imageFile);
          // $scope.imageData = canvas.toDataURL('image/png');
          // console.log($scope.imageData);
        }
      }


    };

    function dataURItoBlob(dataURI) {
      // Parse the data URI components
      var parts = dataURI.split(',');
      var byteString = atob(parts[1]);
      var mimeString = parts[0].split(':')[1].split(';')[0]; // Extract MIME type

      // Convert byte string to ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // Create Blob object with appropriate MIME type
      return new Blob([ab], { type: mimeString });
    }



    $scope.uploadFile = function (file) {
      var form_data = new FormData;
      form_data.append('module', 'picture');
      form_data.append("file", file, 'image.png');

      var config = {
        transformResponse: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      }
      var url = "upload/addFile";

      $http.post(url, form_data, config).then(
        // Success
        function (response) {
          console.log(response);
          $scope.form.grossWeightImageLink = response.data;
          console.log($scope.form);
          Swal.fire({
            text: "File Uploaded",
            icon: "success",
            buttonsStyling: !1,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary"
            }
          })
        },
        // Error
        function (response) {
          Swal.fire({
            text: "File Upload failed! Please Upload Again",
            icon: "error",
            buttonsStyling: !1,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary"
            }
          })
          console.log(response);
        }
      );
    }

    $scope.changeView = function (view) {
      if (view == "add" || view == "list" || view == "show") {
        $scope.form = {};
      }
      $scope.views.add = false;
      $scope.views.show = false;
      $scope.views.list = false;
      $scope.views[view] = true;
    };
  }
  )

  .controller("QCController", function ($scope, $http, $timeout, DTOptionsBuilder, $q) {
    $scope.form = {};
    $scope.views = {};
    $scope.views.list = true;
    $scope.controlDisable = true;
    $scope.token = '';
    let typingTimer; // Timer identifier
    const doneTypingInterval = 500; // Time in ms, 500ms example
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

    autoTokenFetch();
    function autoTokenFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/token/getTokensForQC",
      }).then(
        function successCallback(response) {
          $scope.tokens = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.qcCheck = function () {
      showHideLoad();
      $q.all([$scope.getItemType(), $scope.getUnloadingLocation()]).then(function () {
        $scope.controlDisable = true;
        $scope.changeItem = false;
        $scope.token = '';
        $scope.form = {};
        $("#QC_modal").modal("show");
        showHideLoad(true);
      });
    };


    $scope.delayedGetToken = function (token) {
      // Clear the previous timer
      if (typingTimer) {
        $timeout.cancel(typingTimer);
      }

      // Start a new timer
      typingTimer = $timeout(function () {
        $scope.getToken(token);
      }, doneTypingInterval);
    };


    $scope.getToken = function (token) {
      if (token !== null || token !== undefined || token !== '') {
        $scope.controlDisable = true;
        $scope.form = {};
        showHideLoad();
        $http({
          method: "GET",
          params: { token: token },
          url: "api/v1/token/getTokenByTokenNumber",
        }).then(
          function successCallback(response) {
            showHideLoad(true);
            if (response.data.qcStatus == true) {
              $("#QC_modal").modal("hide");
              Swal.fire({
                text: "Already Done!",
                icon: "success"
              });
              return;
            }
            $scope.form = response.data;
            $scope.controlDisable = false;
            showHideLoad(true);
          },
          function errorCallback(response) {
            showHideLoad(true);
            console.log(response.statusText);
          }
        );
      }
    }

    $scope.getItemType = function () {
      return $q(function (resolve, reject) {
        $scope.items = {};
        showHideLoad();
        $http({
          method: "GET",
          url: "api/v1/item/getAllItem",
        }).then(
          function successCallback(response) {
            $scope.items = response.data;
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

    $scope.getUnloadingLocation = function () {
      return $q(function (resolve, reject) {
        $scope.items = {};
        showHideLoad();
        $http({
          method: "GET",
          url: "api/v1/unloadingPoint/getAllUnloadingPoint",
        }).then(
          function successCallback(response) {
            $scope.unloadingPoints = response.data;
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



    $scope.close = function () {
      $scope.form = {};
      $scope.controlDisable = true;
      $scope.changeItem = false;
      $("#QC_modal").modal("hide");
    }

    $scope.itemChange = function (id) {
      $scope.selectedItem = $scope.items.find(item => item.id === id) || null;
      if ($scope.selectedItem !== null) {
        $scope.form.itemType = $scope.selectedItem.type
        $scope.form.itemId = $scope.selectedItem.id
        $scope.form.item = $scope.selectedItem.name
        $scope.form.unit = $scope.selectedItem.unit
        $scope.form.rate = $scope.selectedItem.rate
      }
    }

    $scope.unloadingPointSelect = function (id) {
      $scope.selectedItem = $scope.unloadingPoints.find(point => point.id === id) || null;
      if ($scope.selectedItem !== null) {
        $scope.form.unloadingPoint = $scope.selectedItem.name;
        $scope.form.unloadingPointId = $scope.selectedItem.id;
      }
    }


    $scope.getItem = function () {
      return $q(function (resolve, reject) {
        // $scope.items = {};
        showHideLoad();
        $http({
          method: "GET",
          url: "api/v1/item/getItem",
        }).then(
          function successCallback(response) {
            // console.log(response.data);
            $scope.itemsD = response.data;
            console.log($scope.items);
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

    $scope.saveToken = function () {
      if ($scope.controlDisable) {
        return;
      }
      else {
        showHideLoad();
        var method = "PUT";
        var url = "api/v1/token/updateTokenFromQC";
        $http({
          method: method,
          url: url,
          data: angular.toJson($scope.form),
          headers: {
            "Content-Type": "application/json",
          },
          transformResponse: angular.identity,
        }).then(_success, _error);
      }
    };

    function _success(response) {
      showHideLoad(true);
      $("#QC_modal").modal("hide");
      autoTokenFetch();
      // Swal.fire({
      //   text: response.data,
      //   icon: "success",
      //   buttonsStyling: !1,
      //   confirmButtonText: "Ok, got it!",
      //   customClass: {
      //     confirmButton: "btn btn-primary",
      //   },
      // });
      $scope.tokenPrint(response.data);
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

    $scope.tokenPrint = function (id) {
      document.getElementById("barcode").innerHTML = "";
      showHideLoad();
      $http({
        method: "GET",
        params: { id: id },
        url: "api/v1/token/getTokenForPrint",
      }).then(
        function successCallback(response) {
          console.log(response.data);
          $scope.printData = response.data;
          JsBarcode("#barcode", response.data.token.tokenNumber, {
            format: "CODE39",
            width: 1,
            height: 50,
            displayValue: true,
          });

          var canvas = document.getElementById('barcode');
          barcodeImage = new Image();
          barcodeImage.src = canvas.toDataURL('image/png');
          $scope.imageBarCode = barcodeImage.src

          console.log(barcodeImage.src);

          $("#print_modal").modal("show");
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
      $scope.views.show = false;
      $scope.views.list = false;
      $scope.views[view] = true;
    };
  }
  )

  .controller("TareWeightController", function ($scope, $http, $timeout, DTOptionsBuilder, $q) {
    $scope.form = {};
    $scope.views = {};
    $scope.views.list = true;
    $scope.controlDisable = true;
    $scope.manualWeight = false;
    $scope.token = '';
    $scope.cameraUrl = '';
    $scope.capturedImage = '';
    $scope.url = '';

    let typingTimer; // Timer identifier
    const doneTypingInterval = 500; // Time in ms, 500ms example


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

    autoTokenFetch();
    function autoTokenFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/token/getTokensForTareWeight ",
      }).then(
        function successCallback(response) {
          $scope.tokens = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.enterTareWeight = function () {
      showHideLoad();
      $q.all([$scope.getWeighBridge()]).then(function () {
        $scope.controlDisable = true;
        $scope.manualWeight = false;
        $scope.cameraDisable = true;
        $scope.token = '';
        $scope.url = '';
        $scope.cameraUrl = '';
        $scope.form = {};
        $("#tare_weight_modal").modal("show");
        showHideLoad(true);
      });
    };


    $scope.delayedGetToken = function (token) {
      // Clear the previous timer
      if (typingTimer) {
        $timeout.cancel(typingTimer);
      }

      // Start a new timer
      typingTimer = $timeout(function () {
        $scope.getToken(token);
      }, doneTypingInterval);
    };


    $scope.getToken = function (token) {
      if (token !== null || token !== undefined || token !== '') {
        $scope.controlDisable = true;
        $scope.form = {};
        showHideLoad();
        $http({
          method: "GET",
          params: { token: token },
          url: "api/v1/token/getTokenByTokenNumber",
        }).then(
          function successCallback(response) {
            showHideLoad(true);
            if (response.data.qcStatus == true) {
              if (response.data.tareWeightStatus == true) {
                $("#tare_weight_modal").modal("hide");
                Swal.fire({
                  text: "Already Done!",
                  icon: "success"
                });
              }
              else {
                $scope.form = response.data;
                $scope.controlDisable = false;
                showHideLoad(true);
              }
            }
            else {
              $("#tare_weight_modal").modal("hide");
              Swal.fire({
                text: "QC Not Done.Please Do first!",
                icon: "error"
              });
            }
          },
          function errorCallback(response) {
            showHideLoad(true);
            console.log(response.statusText);
          }
        );
      }
    }

    $scope.getWeighBridge = function () {
      return $q(function (resolve, reject) {
        $scope.weighBridges = {};
        showHideLoad();
        $http({
          method: "GET",
          url: "api/v1/weighBridge/getWeighBridge ",
        }).then(
          function successCallback(response) {
            $scope.weighBridges = response.data;
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

    $scope.close = function () {
      $scope.form = {};
      $("#tare_weight_modal").modal("hide");
    }

    $scope.checkLocation = function (data) {
      $scope.url = ''
      $scope.cameraUrl = '';
      $scope.imageFile = '';
      $scope.capturedImage = '';
      $scope.form.grossWeightImageLink = '';
      $scope.cameraDisable = true;
      $scope.form.tareWeight = 0.00;
      const foundItem = $scope.weighBridges.find(bridge => bridge.code === data);
      $scope.form.tareWeightWeighBridge = foundItem.name;

      if (foundItem.cameraEnable === 'YES') {
        $scope.cameraDisable = false;
        $scope.url = foundItem.ip;
      }

      if (foundItem.manualStatus === 'YES') {
        $scope.manualWeight = true;
      }
      else {
        $scope.manualWeight = false;

      }
    }


    $scope.getWeight = function (site) {
      if (site === undefined || site === '' || site === null) {
        Swal.fire({
          text: 'Please Select  Weigh Bridge',
          icon: "error",
          buttonsStyling: !1,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
        return;
      }
      showHideLoad();
      $http({
        method: "GET",
        params: { site: site },
        url: "api/v1/weightData/getWeight",
      }).then(
        function successCallback(response) {
          console.log(response.data);
          $scope.form.tareWeight = response.data.weightData;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.saveToken = function () {
      if ($scope.controlDisable) {
        return;
      }
      else {
        if ($scope.form.tareWeight < $scope.form.minWeight) {
          Swal.fire({
            text: 'The gross weight must be greater than or equal to ' + $scope.form.minWeight + 'Kg',
            icon: "error",
            buttonsStyling: !1,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
          return;
        }
        // Handle form submission
        $http({
          method: "PUT",
          url: "api/v1/token/updateTokenFromTearWeight",
          data: angular.toJson($scope.form),
          headers: {
            "Content-Type": "application/json",
          },
          transformResponse: angular.identity,
        }).then(_success, _error);
      }
    };

    function _success(response) {
      console.log(response.data);
      showHideLoad(true);
      $("#tare_weight_modal").modal("hide");
      autoTokenFetch();
      $scope.tokenPrint(response.data);
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

    $scope.tokenPrint = function (id) {
      document.getElementById("barcode").innerHTML = "";
      showHideLoad();
      $http({
        method: "GET",
        params: { id: id },
        url: "api/v1/token/getTokenForPrint",
      }).then(
        function successCallback(response) {
          console.log(response.data);
          $scope.printData = response.data;
          JsBarcode("#barcode", response.data.token.tokenNumber, {
            format: "CODE39",
            width: 1,
            height: 50,
            displayValue: true,
          });

          var canvas = document.getElementById('barcode');
          barcodeImage = new Image();
          barcodeImage.src = canvas.toDataURL('image/png');
          $scope.imageBarCode = barcodeImage.src

          console.log(barcodeImage.src);

          $("#print_modal").modal("show");
          showHideLoad(true);
        },
        function errorCallback(response) {
          //console.log(response.statusText);
        }
      );
    };

    $scope.startCamera = function () {
      $scope.capturedImage = '';
      $scope.cameraUrl = '';
      // Set the camera URL (replace with your actual camera feed URL)
      $scope.cameraUrl = $scope.url + '/video';
    };

    $scope.captureImage = function () {
      if (!$scope.cameraDisable) {
        const photoUrl = $scope.url + '/shot.jpg?' + new Date().getTime();
        $scope.capturedImage = photoUrl;
        $scope.cameraUrl = '';

        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = $scope.capturedImage;
        img.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          var capturedImageData = canvas.toDataURL('image/png');

          $scope.capturedImage = capturedImageData;
          $scope.imageFile = dataURItoBlob(capturedImageData);
          $scope.uploadFile($scope.imageFile);
          // $scope.imageData = canvas.toDataURL('image/png');
          // console.log($scope.imageData);
        }
      }


    };

    function dataURItoBlob(dataURI) {
      // Parse the data URI components
      var parts = dataURI.split(',');
      var byteString = atob(parts[1]);
      var mimeString = parts[0].split(':')[1].split(';')[0]; // Extract MIME type

      // Convert byte string to ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // Create Blob object with appropriate MIME type
      return new Blob([ab], { type: mimeString });
    }



    $scope.uploadFile = function (file) {
      var form_data = new FormData;
      form_data.append('module', 'picture');
      form_data.append("file", file, 'image.png');

      var config = {
        transformResponse: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      }
      var url = "upload/addFile";

      $http.post(url, form_data, config).then(
        // Success
        function (response) {
          $scope.form.tareWeightImageLink = response.data;
          console.log($scope.form);
          Swal.fire({
            text: "File Uploaded",
            icon: "success",
            buttonsStyling: !1,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary"
            }
          })
        },
        // Error
        function (response) {
          Swal.fire({
            text: "File Upload failed! Please Upload Again",
            icon: "error",
            buttonsStyling: !1,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary"
            }
          })
          console.log(response);
        }
      );
    }


    $scope.changeView = function (view) {
      if (view == "add" || view == "list" || view == "show") {
        $scope.form = {};
      }
      $scope.views.add = false;
      $scope.views.show = false;
      $scope.views.list = false;
      $scope.views[view] = true;
    };
  })

  .controller("BillGeneration", function ($scope, $http, $timeout, DTOptionsBuilder, $q) {
    $scope.form = {};
    $scope.views = {};
    $scope.views.list = true;
    $scope.selectList = false;
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

    autoTokenFetch();
    function autoTokenFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/token/getTokensForBill ",
      }).then(
        function successCallback(response) {
          console.log(response.data);
          $scope.tokens = response.data;
          angular.forEach($scope.tokens, function (token) {
            token.select = false;
          });
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.selectFn = function () {
      $scope.selectList = !$scope.selectList
      angular.forEach($scope.tokens, function (token) {
        token.select = $scope.selectList;
      });
    };

    $scope.multiApproveFn = function () {
      var list = []
      angular.forEach($scope.tokens, function (token) {
        if (token.select) {
          list.push(token.id)
        }
      });

      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to authorization all selected bill?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, authorization it!'
      }).then((result) => {
        if (result.isConfirmed) {
          showHideLoad();
          $http({
            method: "PUT",
            params: { ids: list },
            url: "api/v1/token/authorizeMultiTokenBill",
            headers: {
              "Content-Type": "application/json",
            },
            transformResponse: angular.identity,
          }).then(_success, _error);
        }
      });

    };

    function _success(response) {
      showHideLoad(true);
      $("#add_edit_token_modal").modal("hide");
      autoTokenFetch();
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

    $scope.BillAuthorization = function (id) {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to authorization this bill?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, authorization it!'
      }).then((result) => {
        if (result.isConfirmed) {
          showHideLoad();
          $http({
            method: "PUT",
            params: { id: id },
            url: "api/v1/token/authorizeTokenBill",
            headers: {
              "Content-Type": "application/json",
            },
            transformResponse: angular.identity,
          }).then(_success, _error);
        }
      });
    };

    $scope.billPrint = function (id) {
      document.getElementById("barcode").innerHTML = "";
      showHideLoad();
      $http({
        method: "GET",
        params: { id: id },
        url: "api/v1/token/getTokenForPrint",
      }).then(
        function successCallback(response) {
          console.log(response.data);
          $scope.printData = response.data;
          JsBarcode("#barcode", response.data.token.tokenNumber, {
            format: "CODE39",
            width: 1,
            height: 50,
            displayValue: true,
          });

          var canvas = document.getElementById('barcode');
          barcodeImage = new Image();
          barcodeImage.src = canvas.toDataURL('image/png');
          $scope.imageBarCode = barcodeImage.src

          console.log(barcodeImage.src);

          $("#print_modal").modal("show");
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
      $scope.views.show = false;
      $scope.views.list = false;
      $scope.views[view] = true;
    };
  }
  )

  .controller("PaymentAuthorization", function ($scope, $http, $timeout, DTOptionsBuilder, $q) {
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

    autoTokenFetch();
    function autoTokenFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/token/getBillForPayment ",
      }).then(
        function successCallback(response) {
          $scope.tokens = response.data;
          angular.forEach($scope.tokens, function (value, key) {
            value.select = false;
          });
          // console.log($scope.tokens);
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    };

    $scope.payBill = function () {
      $scope.controlDisable = true;
      $scope.token = {};
      $scope.tokenBill = [];
      $scope.tokenNumber = '';
      $scope.paidTo = '';
      $scope.mobile = '';
      $("#billing_modal").modal("show");
    };
    $scope.rowRemove = function (index) {
      $scope.tokenBill.splice(index, 1);
    };

    $scope.getBillData = function () {
      console.log($scope.token)
      if (!$scope.paidTo || !$scope.mobile) {
        Swal.fire({ text: "Paid to and Contact number are required!", icon: "error" });
        return;
      }

      if ($scope.tokenBill.length === 0 || !$scope.tokenBill.some(bill => bill.billNumber === $scope.token.tokenNumber)) {
        if ($scope.tokenBill.length !== 0 && $scope.tokenBill.some(bill => bill.vendorId !== $scope.token.vendorId)) {
          Swal.fire({ text: "Vendor ID mismatch!", icon: "error" });
          return;
        }

        $scope.tokenBill.push({
          vendorId: $scope.token.vendorId,
          item: $scope.token.itemType + '-' + $scope.token.item,
          billNumber: $scope.token.tokenNumber,
          grossAmount: $scope.token.grandTotal,
          paidAmount: $scope.token.paidAmount,
          remainingAmount: $scope.token.grandTotal - $scope.token.paidAmount,
          payable: $scope.token.grandTotal - $scope.token.paidAmount,
          paidTo: $scope.paidTo,
          contactNumber: $scope.mobile
        });
      } else {
        Swal.fire({ text: "Bill number already added!", icon: "error" });
      }
    };



    $scope.getToken = function (token) {
      if (token !== null || token !== undefined || token !== '') {
        $scope.controlDisable = true;
        $scope.form = {};
        showHideLoad();
        $http({
          method: "GET",
          params: { token: token },
          url: "api/v1/token/getTokenByTokenNumber",
        }).then(
          function successCallback(response) {
            showHideLoad(true);
            if (response.data.billAuthorization == true) {
              $scope.token = response.data;
              console.log($scope.token);
              $scope.controlDisable = false;
            }
            else {
              Swal.fire({
                text: "Bill Not Authorize Still!",
                icon: "error"
              });
              return;
            }

          },
          function errorCallback(response) {
            showHideLoad(true);
            console.log(response.statusText);
          }
        );
      }
    }


    $scope.saveBill = function () {
      showHideLoad();
      var method = "POST";
      var url = "api/v1/token/billPayment";
      $http({
        method: method,
        url: url,
        data: angular.toJson($scope.tokenBill),
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(_success, _error);
    };

    function _success(response) {
      showHideLoad(true);
      autoTokenFetch();
      $("#billing_modal").modal("hide");
      $scope.BillPrint(response.data);
    }

    function _error(response) {
      showHideLoad(true);
    }


    $scope.BillPrint = function (billNumber) {
      showHideLoad();
      $http({
        method: "GET",
        params: { bill: billNumber },
        url: "api/v1/token/getBillForPrint",
      }).then(
        function successCallback(response) {
          console.log(response.data);
          $scope.printData = response.data;
          $("#print_modal").modal("show");
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
      $scope.views.show = false;
      $scope.views.list = false;
      $scope.views[view] = true;
    };
  }
  )

  .controller("HoldPayment", function ($scope, $http, $timeout, DTOptionsBuilder, $q) {
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

    autoTokenFetch();
    function autoTokenFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/token/getHoldBillForPayment ",
      }).then(
        function successCallback(response) {
          console.log(response.data);
          $scope.tokens = response.data;
          angular.forEach($scope.tokens, function (token) {
            token.select = false;
          });
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.vendorCheck = function (index) {
      let selectedTokens = $scope.tokens.filter(token => token.select);
      if (selectedTokens.length > 0) {
        let selectedVendor = selectedTokens[0].vendorId;
        let allSameVendor = selectedTokens.every(token => token.vendorId === selectedVendor);

        if (!allSameVendor) {
          Swal.fire('Different vendors selected', 'Please select tokens from the same vendor', 'error');
          $scope.tokens[index].select = false;
        }
      }
    };


    $scope.payHoldBill = function () {
      let selectedTokens = $scope.tokens.filter(token => token.select);

      if (selectedTokens.length === 0) {
        Swal.fire('No vendor selected', 'Please select a vendor', 'warning');
        return;
      }

      $scope.tokenBill = [];
      $scope.paidTo = '';
      $scope.mobile = '';
      $scope.selectedToken = selectedTokens;
      angular.forEach($scope.tokens, function (token) {
        if (token.select) {

          $scope.tokenBill.push({
            vendorId: token.vendorId,
            billNumber: token.tokenNumber,
            item: token.itemType + '-' + token.item,
            grossAmount: token.grandTotal,
            paidAmount: token.paidAmount,
            remainingAmount: token.grandTotal - token.paidAmount,
            payable: token.holdBillValue,
            paidTo: $scope.paidTo,
            contactNumber: $scope.mobile
          });

        }
      });

      $("#billing_modal").modal("show");

    };

    $scope.rowRemove = function (index) {
      $scope.tokenBill.splice(index, 1);
    };


    $scope.saveBill = function () {
      angular.forEach($scope.tokenBill, function (token) {
        token.contactNumber = $scope.mobile;
        token.paidTo = $scope.paidTo;
        token.holdBill = true;
      });
      showHideLoad();
      var method = "POST";
      var url = "api/v1/token/billPayment";
      $http({
        method: method,
        url: url,
        data: angular.toJson($scope.tokenBill),
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(_success, _error);
    };


    function _success(response) {
      showHideLoad(true);
      autoTokenFetch();
      $("#billing_modal").modal("hide");
      $scope.BillPrint(response.data);
    }

    function _error(response) {
      showHideLoad(true);
    }




    $scope.BillPrint = function (billNumber) {
      showHideLoad();
      $http({
        method: "GET",
        params: { bill: billNumber },
        url: "api/v1/token/getBillForPrint",
      }).then(
        function successCallback(response) {
          console.log(response.data);
          $scope.printData = response.data;
          $("#print_modal").modal("show");
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
      $scope.views.show = false;
      $scope.views.list = false;
      $scope.views[view] = true;
    };
  }
  )

  .controller("PaidBill", function ($scope, $http, $timeout, DTOptionsBuilder, $q) {
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

    autoTokenFetch();
    function autoTokenFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/token/getPaidBill ",
      }).then(
        function successCallback(response) {
          console.log(response.data);
          $scope.tokens = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.BillPrint = function (billNumber) {
      showHideLoad();
      $http({
        method: "GET",
        params: { bill: billNumber },
        url: "api/v1/token/getBillForPrint",
      }).then(
        function successCallback(response) {
          console.log(response.data);
          $scope.printData = response.data;
          $("#print_modal").modal("show");
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
      $scope.views.show = false;
      $scope.views.list = false;
      $scope.views[view] = true;
    };
  }
  )


  .controller("TokenDataUpdate", function ($scope, $http, $timeout, DTOptionsBuilder, $q) {
    $scope.form = {};
    $scope.views = {};
    $scope.views.list = true;
    $scope.controlDisable = true;
    $scope.manualWeight = false;
    $scope.token = '';
    $scope.cameraUrl = '';
    $scope.capturedImage = '';
    $scope.url = '';

    let typingTimer; // Timer identifier
    const doneTypingInterval = 500; // Time in ms, 500ms example

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



    autoTokenFetch();
    function autoTokenFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/v1/tokenDataUpdate/getUpdatedToken",
      }).then(
        function successCallback(response) {
          console.log(response.data);
          $scope.tokens = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }


    $scope.enterGrossToken = function () {
      showHideLoad();
      $q.all([$scope.getItemType()]).then(function () {
        $scope.controlDisable = true;
        $scope.form = {};
        $("#gross_weight_modal").modal("show");
        showHideLoad(true);
      });
    };


    $scope.getItemType = function () {
      return $q(function (resolve, reject) {
        $scope.items = {};
        showHideLoad();
        $http({
          method: "GET",
          url: "api/v1/item/getAllItem",
        }).then(
          function successCallback(response) {
            $scope.items = response.data;
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



    $scope.delayedGetToken = function (token) {
      // Clear the previous timer
      if (typingTimer) {
        $timeout.cancel(typingTimer);
      }
      // Start a new timer
      typingTimer = $timeout(function () {
        $scope.getToken(token);
      }, doneTypingInterval);
    };

    $scope.getToken = function (token) {
      if (token !== null || token !== undefined || token !== '') {
        $scope.controlDisable = true;
        $scope.form = {};
        showHideLoad();
        $http({
          method: "GET",
          params: { token: token },
          url: "api/v1/tokenDataUpdate/getDataByTokenNumber",
          headers: {
            "Content-Type": "application/json",
          },
          transformResponse: angular.identity,
        }).then(
          function successCallback(response) {
            showHideLoad(true);
            $scope.form = JSON.parse(response.data);
            $scope.controlDisable = false;
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
      }
    }

    $scope.close = function () {
      $scope.form = {};
      $("#gross_weight_modal").modal("hide");
    }


    $scope.saveToken = function () {
      if ($scope.controlDisable) {
        return;
      }
      else {
        $http({
          method: "POST",
          url: "api/v1/tokenDataUpdate/createTokenDataUpdate",
          data: angular.toJson($scope.form),
          headers: {
            "Content-Type": "application/json",
          },
          transformResponse: angular.identity,
        }).then(_success, _error);
      }
    };

    function _success(response) {
      showHideLoad(true);
      $("#gross_weight_modal").modal("hide");
      autoTokenFetch();
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
    $scope.changeView = function (view) {
      if (view == "add" || view == "list" || view == "show") {
        $scope.form = {};
      }
      $scope.views.add = false;
      $scope.views.show = false;
      $scope.views.list = false;
      $scope.views[view] = true;
    };
  }
  )

  ;
