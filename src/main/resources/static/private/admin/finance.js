var app = angular.module("AdminManagment", ["datatables", "datatables.buttons",]);

// DIRECTIVE - Multi TAB
app.directive("showtab", function () {
  return {
    link: function (scope, element, attrs) {
      element.click(function (e) {
        e.preventDefault();
        $(element).tab("show");
      });
    },
  };
});

// DIRECTIVE - FILE MODEL
app.directive("fileModel", [
  "$parse",
  function ($parse) {
    return {
      restrict: "A",
      link: function (scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind("change", function () {
          scope.$apply(function () {
            modelSetter(scope, element[0].files[0]);
          });
        });
      },
    };
  },
]);


app.controller("AssetCategoryController", function ($scope, $http, $timeout, DTOptionsBuilder) {
  $scope.form = {};
  $scope.rows = [{ caption: '', name: '', life: '' }];
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
            title: "Asset Category",
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
            title: "Asset Category",
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
            title: "Asset Category",
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
      {
        extend: "colvis",
        text: '<span class="lbl-dropdown">Columns</span><span class="icon-common icon-btn-dropdown icon-chevron"></span>',
      },

    ]);

  autoAssetCategoryListFetch();
  function autoAssetCategoryListFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "assetCategory/getAllAssetCategory",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.assetCategories = response.data;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  }

  $scope.AddAssetCat = function () {
    $scope.form = {};
    $("#add_edit_assetCat_modal").modal("show");
  };

  $scope.addEditSaveAssetCat = function () {
    //console.log($scope.form);
    showHideLoad();
    if ($scope.form.id == "" || $scope.form.id == undefined) {
      var method = "POST";
      var url = "assetCategory/createAssetCategory";
    } else {
      var method = "PUT";
      var url = "assetCategory/updateAssetCategory";
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
    $("#add_edit_assetCat_modal").modal("hide");
    $("#add_subcat_modal").modal("hide");
    $("#edit_subcat_modal").modal("hide");
    autoAssetCategoryListFetch();
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
  $scope.editAssetCat = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "assetCategory/getAssetCategoryById",
    }).then(
      function successCallback(response) {
        //console.log(response.data);
        $scope.form = response.data;
        $("#add_edit_assetCat_modal").modal("show");
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
      url: "assetCategory/toggleAssetCategoryStatus",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        //console.log(response.data);
        autoAssetCategoryListFetch();
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.addSubCat = function (id) {
    $scope.rows = [{ assetCategoryId: id, name: '', life: '' }];
    $scope.assetCategoryId = id;
    $("#add_subcat_modal").modal("show");
  };

  $scope.addRow = function () {
    $scope.rows.push({ assetCategoryId: $scope.assetCategoryId, name: '', life: '' });
  };

  $scope.removeRow = function (index) {
    $scope.rows.splice(index, 1);
  };

  $scope.addSaveSubCat = function () {
    //console.log($scope.form);
    showHideLoad();

    var method = "POST";
    var url = "assetSubCategory/createAssetSubCategory";
    $http({
      method: method,
      url: url,
      data: angular.toJson($scope.rows),
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(_success, _error);
  };

  $scope.fetchAllSubCats = function (id, subcats) {
    $scope.asset_cat_id = id;
    $scope.subcats = subcats;
    $("#show_subcat_modal").modal("show");
  };

  $scope.editAssetSubCat = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "assetSubCategory/getAssetSubCategoryById",
    }).then(
      function successCallback(response) {
        $("#show_subcat_modal").modal("hide");
        //console.log(response.data);
        $scope.form = response.data;
        $("#edit_subcat_modal").modal("show");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };


  $scope.editSaveSubCat = function () {
    //console.log($scope.form);
    showHideLoad();

    var method = "PUT";
    var url = "assetSubCategory/updateAssetSubCategory";
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

  $scope.changeSubCatStatus = function (id) {
    showHideLoad();
    $http({
      method: "DELETE",
      params: { id: id },
      url: "assetSubCategory/toggleAssetSubCategoryStatus",
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
);

app.controller("AssetFinanceController", function ($scope, $http, $timeout, DTOptionsBuilder, $q) {
  $scope.views = {};
  $scope.views.list = true;
  $scope.dtOptions = DTOptionsBuilder.newOptions()
  .withOption("stateSave", true) // Enable state saving
    .withOption("lengthMenu", [
      [5, 10, 50, 100, 1000, -1],
      [5, 10, 50, 100, 1000, "All"],
    ])
    .withOption("pageLength", 5) // Add default page length
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
            title: "TypeReport",
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
            title: "TypeReport",
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
            title: "TypeReport",
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
      {
        extend: "colvis",
        text: '<span class="lbl-dropdown">Columns</span><span class="icon-common icon-btn-dropdown icon-chevron"></span>',
      },

    ]);

  autoAssetListFetch();
  function autoAssetListFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "asset/getAssetsForFinance",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.assets = response.data;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  }

  $scope.AddFinanceEntry = function (assetId) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: assetId },
      url: "asset/getAssetCostAndPurchase",
    }).then(
      function successCallback(response) {
        console.log(response.data);
        $scope.form = {};
        $scope.form.cost = response.data[0].cost;
        $scope.form.putToUseDate = response.data[0].purchased_date;
        $scope.form.putToUseDateAvailability = "true";
        $scope.salvageValueFinder();
        $scope.form.tempAssetId = assetId;
        $scope.fetchAssetCat();
        $("#Asset_finance_entry").modal("show");

        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };

  $scope.uploadModal = function () {
    $("#upload_modal").modal("show");
  };


  $scope.fetchAssetCategoryIds = function (type) {
    showHideLoad();
    $http({
      method: "GET",
      url: "asset/getAssetIds",
    }).then(
      function successCallback(response) {
        console.log(response.data);
        $scope.typeDropDown = response.data;
        $("#Dropdown-details").modal("show");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };


  $scope.downloadExcel = function () {
    showHideLoad();
    $http({
      method: 'GET',
      responseType: 'arraybuffer',
      url: 'excel/getAssetFinanceTemplate'
    }).then(function successCallback(response) {
      var contentDisposition = response.headers('Content-Disposition');
      var filename = extractFilenameFromContentDisposition(contentDisposition);

      var blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

      // Trigger file download
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename || 'finance_asset.xlsx'; // Use filename from headers or default to 'asset_template.xlsx'
      link.click();
      showHideLoad(true);
    }, function errorCallback(response) {
      Swal.fire({
        text: "File Not Found! Please Upload Again",
        icon: "error",
        buttonsStyling: !1,
        confirmButtonText: "Ok, got it!",
        customClass: {
          confirmButton: "btn btn-primary"
        }
      });
      showHideLoad(true);
    });
  }

  function extractFilenameFromContentDisposition(contentDisposition) {
    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    var matches = filenameRegex.exec(contentDisposition);
    if (matches != null && matches[1]) {
      return matches[1].replace(/['"]/g, '');
    }
    return null;
  }


  $scope.uploadExcel = function (data, type) {
    if (
      data.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      data.type === "application/vnd.ms-excel"
    ) {
      Swal.fire({
        title: "Are you sure?",
        text: "you want to Upload this Excel File?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save it!",
      }).then((result) => {
        if (result.isConfirmed) {
          showHideLoad();
          var form_data = new FormData();
          form_data.append("type", type);
          form_data.append("file", data);
          var config = {
            transformResponse: angular.identity,
            headers: {
              "Content-Type": undefined,
            },
          };
          var url = "common/uploadExcelForAssetFinance";

          $http.post(url, form_data, config).then(_success, _error);
        }
      });
    } else {
      Swal.fire({
        text: "Please select a valid Excel file",
        icon: "error",
        buttonsStyling: !1,
        confirmButtonText: "Ok, got it!",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      });
    }
  };




  $scope.editFinanceEntry = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "asset/getFinanceByAssetId",
    }).then(
      function successCallback(response) {
        console.log(response.data);
        $scope.form = response.data;
        $scope.fetchSubcategory(response.data.assetCategoryId);
        $scope.fetchAssetCat();
        $scope.form.putToUseDateAvailability = JSON.stringify(response.data.putToUseDateAvailability);
        $scope.form.tempAssetId = id;
        $("#Asset_finance_entry").modal("show");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };


  $scope.fetchAssetCat = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "assetCategory/getAllAssetCategory",
    }).then(
      function successCallback(response) {
        $scope.asset_cats = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };
  $scope.fetchSubcategory = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "assetCategory/getAssetCategoryById",
    }).then(
      function successCallback(response) {
        $scope.asset_subcats = response.data.assetSubCategory;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.fetchLife = function (id, subasset) {
    angular.forEach(subasset, function (value, key) {
      if (value.id == id) {
        $scope.form.life = value.life;
        if ($scope.form.id == "" || $scope.form.id == undefined) {
          $scope.form.assetLife = value.life;
        }
      }
    });
  };

  $scope.salvageValueFinder = function () {
    var depreciableAsset = $scope.form.depreciableAsset;
    var cost = $scope.form.cost
    if (depreciableAsset == true) {
      // Convert the cost to a double (if it's a string)
      var costAsDouble = parseFloat(cost);
      if (!isNaN(costAsDouble)) {
        // Conversion was successful
        $scope.form.salvageValue = (costAsDouble * 5) / 100; // Calculate and set the numeric value
        $scope.form.assetLife = $scope.form.life;
        //console.log($scope.form.salvageValue);
      } else {
        // Conversion failed (cost is not a valid number)
        $scope.form.salvageValue = 0; // or any other appropriate value
        $scope.form.assetLife = $scope.form.life;

      }
    }
  };

  $scope.SaveFinanceEntry = function () {
    //console.log($scope.form);
    showHideLoad();
    if ($scope.form.id == "" || $scope.form.id == undefined) {
      var method = "PUT";
      var url = "asset/updateFinanceEntry";
    } else {
      var method = "PUT";
      var url = "asset/updateFinanceEntryEdit";
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
    console.log(response.data);
    showHideLoad(true);
    $("#Asset_finance_entry").modal("hide");
    $("#upload_modal").modal("hide");
    autoAssetListFetch();
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
      $scope.form = {
        serialNos: [],
      };
      $scope.form.depreciableAsset = false;
    }
    $scope.views.add = false;
    $scope.views.edit = false;
    $scope.views.list = false;
    $scope.views.show = false;
    $scope.views[view] = true;
  };
}
);

app.controller("AssetInsuranceController", function ($scope, $http, $timeout, DTOptionsBuilder, $q) {
  $scope.form = {
    serialNos: [],
  };
  $scope.views = {};
  $scope.views.list = true;
  $scope.dtOptions = DTOptionsBuilder.newOptions()
  .withOption("stateSave", true) // Enable state saving
    .withOption("lengthMenu", [
      [5, 10, 50, 100, 1000, -1],
      [5, 10, 50, 100, 1000, "All"],
    ])
    .withOption("pageLength", 5) // Add default page length
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
            title: "TypeReport",
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
            title: "TypeReport",
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
            title: "TypeReport",
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
      {
        extend: "colvis",
        text: '<span class="lbl-dropdown">Columns</span><span class="icon-common icon-btn-dropdown icon-chevron"></span>',
      },

    ]);

  autoAssetListFetch();
  function autoAssetListFetch() {
    console.log('hi');
    showHideLoad();
    $http({
      method: "GET",
      url: "asset/getAssetsForInsurance",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.assets = response.data;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  }


  $scope.AddAmcInsurance = function (id, type) {
    $scope.form = {};
    $scope.form.type = type;
    $scope.form.assetId = id;
    $scope.fetchSuppliers();
    $("#update_amc_insurence_modal").modal("show");
    // $scope.changeView("add");
  };


  $scope.fetchSuppliers = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "supplier/getSuppliers",
    }).then(
      function successCallback(response) {
        $scope.suppliers = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };


  function _success(response) {
    showHideLoad(true);
    $("#add_edit_Asset").modal("hide");
    $("#Asset_finance_entry").modal("hide");
    autoAssetListFetch();
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

  $scope.SaveInsuranceAmc = function () {
    showHideLoad();
    $http({
      method: "PUT",
      data: angular.toJson($scope.form),
      url: "asset/updateAssetInsuranceAmc",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        autoAssetListFetch();
        $("#update_amc_insurence_modal").modal("hide");
        Swal.fire({
          text: response.data,
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
        showHideLoad(true);
      },
      function errorCallback(response) {
        Swal.fire("Error!", response.data, "error");
      }
    );
  }

  $scope.changeView = function (view) {
    if (view == "add" || view == "list" || view == "show") {
      $scope.form = {
        serialNos: [],
      };
      $scope.form.depreciableAsset = false;
    }
    $scope.views.add = false;
    $scope.views.edit = false;
    $scope.views.list = false;
    $scope.views.show = false;
    $scope.views[view] = true;
  };
}
);
