angular
  .module("Application")
  .controller("particularController", function ($scope, $http, $timeout, DTOptionsBuilder) {
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
      ]);

    autoParticularsListFetch();
    function autoParticularsListFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/particulars",
      }).then(
        function successCallback(response) {
          $scope.particulars = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.AddParticulars = function () {
      $scope.form = {};
      $("#add_edit_dept_modal").modal("show");
    };

    $scope.addEditSaveParticular = function () {
      //console.log($scope.form);
      showHideLoad();
      if ($scope.form.id == "" || $scope.form.id == undefined) {
        var method = "POST";
        var url = "api/particulars";
      } else {
        var method = "PUT";
        var url = "api/particulars";
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
      autoParticularsListFetch();
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
    $scope.editParticular = function (id) {
      showHideLoad();
      $http({
        method: "GET",
        params: { id: id },
        url: "api/particulars/byId",
      }).then(
        function successCallback(response) {
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
        url: "api/particulars",
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
  .controller("balanceController", function ($scope, $http, $timeout, DTOptionsBuilder) {
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
      ]);

    autoBalanceListFetch();
    function autoBalanceListFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/balance-sheets/getMonthly",
      }).then(
        function successCallback(response) {
          $scope.balances = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.AddBalance = function () {
      $scope.form = {};
      $("#add_edit_dept_modal").modal("show");
    };
    $scope.searchByDate = function (start,end) {
      showHideLoad();
      $http({
        method: "GET",
        params: { start: start,end:end },
        url: "api/balance-sheets/getBalanceByDate",
      }).then(
        function successCallback(response) {
          $scope.balances = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          //console.log(response.statusText);
        }
      );

    };

    $scope.addEditSaveBalance = function () {
      //console.log($scope.form);
      showHideLoad();
      if ($scope.form.id == "" || $scope.form.id == undefined) {
        var method = "POST";
        var url = "api/balance-sheets/add";
      } else {
        var method = "PUT";
        var url = "api/balance-sheets/update";
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
      console.log("response");
      showHideLoad(true);
      autoBalanceListFetch();
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
      console.log(response.data);
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
    $scope.editBalance = function (id) {
      showHideLoad();
      $http({
        method: "GET",
        params: { id: id },
        url: "api/balance-sheets/byId",
      }).then(
        function successCallback(response) {
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
        url: "api/balance-sheets",
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


    $scope.updateTransaction = function () {
      console.log($scope.form);
      showHideLoad();
      var method = "POST";
      var url = "api/transactions/postEntry";
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
      autoBalanceListFetch();
      $("#add_dept_modal").modal("hide");
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

    $scope.getParticularDetails = function (id, data) {
      var particular = data.find(function (item) {
        return item.id === id;
      });
      $scope.form.particularName = particular.name;

    }

    $scope.addTransaction = function (date) {
      $scope.form = {};
      $scope.form.date = date;
      $scope.form.inAmount = 0.00;
      $scope.form.outAmount = 0.00;
      $scope.form.qty = 0.00;
      $scope.getParticulars();
      $("#add_dept_modal").modal("show");
    };

    $scope.getParticulars = function () {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/particulars",
      }).then(
        function successCallback(response) {
          $scope.particulars = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }


    $scope.closeTransaction = function (id) {
      showHideLoad();
      $http({
        method: "PUT",
        params: { id: id },
        url: "api/balance-sheets/close",
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(
        function successCallback(response) {
          Swal.fire({
            text: response.data,
            icon: "success",
            buttonsStyling: !1,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
          autoBalanceListFetch();
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
  .controller("transactionController", function ($scope, $http, $timeout, DTOptionsBuilder) {
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
      ]);

    autoTransactionListFetch();
    function autoTransactionListFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/transactions",
      }).then(
        function successCallback(response) {
          $scope.transactions = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }

    $scope.getParticulars = function () {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/particulars",
      }).then(
        function successCallback(response) {
          $scope.particulars = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }
    $scope.getParticularDetails = function (id, data, sentData) {
      var particular = data.find(function (item) {
        return item.id === id;
      });
      sentData.particularName = particular.name;

    }

    $scope.AddParticular = function () {
      $scope.rows = [{ id: '', date: '', particularId: null, particularName: '', qty: '', inAmount: 0.00, outAmount: 0.00, active: true }];
      $scope.getParticulars();
      $("#add_dept_modal").modal("show");
    };


    $scope.addRow = function () {
      $scope.rows.push({ id: '', date: '', particularId: null, particularName: '', qty: '', inAmount: 0.00, outAmount: 0.00, active: true });
    };

    $scope.removeRow = function (index) {
      if ($scope.rows.length < 2) {
        return Swal.fire({
          text: "MAX limit reached",
          icon: "error",
          buttonsStyling: !1,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      }
      $scope.rows.splice(index, 1);
    };

    $scope.addTransaction = function () {
      showHideLoad();
      var method = "POST";
      var url = "api/transactions";
      $http({
        method: method,
        url: url,
        data: angular.toJson($scope.rows),
        headers: {
          "Content-Type": "application/json",
        },
        transformResponse: angular.identity,
      }).then(_success1, _error1);
    };

    function _success1(response) {
      showHideLoad(true);
      autoTransactionListFetch();
      $("#add_dept_modal").modal("hide");
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
    function _error1(response) {
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







    $scope.updateTransaction = function () {
      showHideLoad();
      var method = "PUT";
      var url = "api/transactions";
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
      autoTransactionListFetch();
      $("#edit_dept_modal").modal("hide");
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
    $scope.editTransaction = function (id) {
      $scope.getParticulars();
      showHideLoad();
      $http({
        method: "GET",
        params: { id: id },
        url: "api/transactions/byId",
      }).then(
        function successCallback(response) {
          $scope.form = response.data;
          $("#edit_dept_modal").modal("show");
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
        url: "api/balance-sheets",
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
  .controller("balanceSheetController", function ($scope, $http, $timeout, DTOptionsBuilder) {
    $scope.form = {};
    $scope.views = {};
    $scope.views.list = true;

    autoFetchBalanceSheet();
    function autoFetchBalanceSheet() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/balance-sheets/getBalanceSheet",
      }).then(
        function successCallback(response) {
          console.log(response);
          $scope.data = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }


    $scope.searchByDate = function (date) {
      showHideLoad();
      $http({
        method: "GET",
        params: { date: date },
        url: "api/balance-sheets/getBalanceSheet",
      }).then(
        function successCallback(response) {
          console.log(response);
          if(response.data == null || response.data == ''){
            showHideLoad(true);
           return Swal.fire({
              text: "NO DATA AVAILABLE",
              icon: "error",
              buttonsStyling: !1,
              confirmButtonText: "Ok, got it!",
              customClass: {
                confirmButton: "btn btn-primary",
              },
            });
          }
          $scope.data = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response);
          showHideLoad(true);
        }
      );
    };

    $scope.calculateProfitOrLoss = function (open, close) {
      const profitOrLoss = close - open;
      const formattedProfitOrLoss = profitOrLoss.toFixed(2); // Round to two decimal places
      if (profitOrLoss > 0) {
        return "Profit: " + formattedProfitOrLoss;
      } else if (profitOrLoss < 0) {
        return "Loss: " + Math.abs(formattedProfitOrLoss);
      } else {
        return "No Profit or Loss";
      }
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
  .controller("headBalanceSheetController", function ($scope, $http, $timeout, DTOptionsBuilder) {
    $scope.form = {};
    $scope.views = {};
    $scope.views.list = true;

    // autoFetchBalanceSheet();
    // function autoFetchBalanceSheet() {
    //   showHideLoad();
    //   $http({
    //     method: "GET",
    //     url: "api/balance-sheets/getBalanceSheet",
    //   }).then(
    //     function successCallback(response) {
    //       console.log(response);
    //       $scope.data = response.data;
    //       showHideLoad(true);
    //     },
    //     function errorCallback(response) {
    //       console.log(response.statusText);
    //     }
    //   );
    // }

    autoParticularsListFetch();
    function autoParticularsListFetch() {
      showHideLoad();
      $http({
        method: "GET",
        url: "api/particulars/getByType",
      }).then(
        function successCallback(response) {
          $scope.particulars = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response.statusText);
        }
      );
    }


    $scope.searchByDate = function (id,start,end) {
      showHideLoad();
      $http({
        method: "GET",
        params: { particularId:id,start:start,end:end },
        url: "api/balance-sheets/getHeadBalanceSheet",
      }).then(
        function successCallback(response) {
          console.log(response);
          if(response.data == null || response.data == ''){
            showHideLoad(true);
           return Swal.fire({
              text: "NO DATA AVAILABLE",
              icon: "error",
              buttonsStyling: !1,
              confirmButtonText: "Ok, got it!",
              customClass: {
                confirmButton: "btn btn-primary",
              },
            });
          }
          $scope.data = response.data;
          showHideLoad(true);
        },
        function errorCallback(response) {
          console.log(response);
          showHideLoad(true);
        }
      );
    };

    $scope.calculateProfitOrLoss = function (open, close) {
      const profitOrLoss = close - open;
      const formattedProfitOrLoss = profitOrLoss.toFixed(2); // Round to two decimal places
      if (profitOrLoss > 0) {
        return "Profit: " + formattedProfitOrLoss;
      } else if (profitOrLoss < 0) {
        return "Loss: " + Math.abs(formattedProfitOrLoss);
      } else {
        return "No Profit or Loss";
      }
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
  ;
