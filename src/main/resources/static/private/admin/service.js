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

app.controller("AssetManagementController", function ($scope, $http, $timeout, DTOptionsBuilder) {
  $scope.form = {};
  $scope.views = {};
  $scope.views.list = true;
  $scope.currentPage = 0;
  $scope.totalPages = 1;
  $scope.pageSize = 10;
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
      url: "asset/getAssetsForManagement",
    }).then(
      function successCallback(response) {
        console.log(response);
        $scope.assets = response.data;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  }

  $scope.changePage = function (pageNumber) {
    showHideLoad();
    $http({
      method: "GET",
      params: { page: pageNumber, pageSize: $scope.pageSize },
      url: "asset/getAssetsForManagement",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.assets = response.data.content;
        $scope.totalPages = response.data.totalPages;
        $scope.currentPage = response.data.number;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.editAssetStatus = function (id, type, docAccess) {
    $scope.form = {};
    $scope.form.assetId = id;
    $scope.form.type = type;
    $scope.form.docAccess = docAccess;
    $scope.subLocations = {};
    $scope.employeies = {};
    $scope.suppliers = {};
    $scope.locations = {};
    //console.log($scope.form);
    if (type == "Assigned" || "Handover") {
      $scope.fetchEmployeies(id);
      $scope.fetchLocation();
    }
    if (type == "Maintenance") {
      $scope.fetchSuppliers();
    }
    if (type == "Reserve") {
      $scope.DepartmentList();
    }
    if (type == "Deployed") {
      $scope.fetchLocation();
    }
    $("#edit_asset_status_modal").modal("show");
  };

  $scope.locationChange = function (id) {
    $scope.form = {};
    $scope.form.assetId = id;
    $scope.locations = {};
    $scope.fetchLocation();
    $("#edit_location_modal").modal("show");
  };

  $scope.fetchEmployeies = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "employee/getEmployeesForAssetManagement",
    }).then(
      function successCallback(response) {
        // console.log(response.data);
        $scope.employeies = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.fetchSuppliers = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "supplier/getServies",
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

  $scope.fetchLocation = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "locations/getLocations",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.locations = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.DepartmentList = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      url: "department/getAllDepartment",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.departments = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.fetchEmpDetail = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "employee/getEmployeeById",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.form.employeeName = response.data.name;
        $scope.form.employeeCode = response.data.employeeId;
        $scope.form.department = response.data.department;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };
  $scope.fetchSupplierDetail = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "supplier/getSupplierById",
    }).then(
      function successCallback(response) {
        $scope.form.supplierName = response.data.name;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };
  $scope.fetchLocationDetail = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "locations/getLocationById",
    }).then(
      function successCallback(response) {
        // console.log(response.data);
        $scope.form.locationId = response.data.id;
        $scope.form.locationName = response.data.name;
        $scope.subLocations = response.data.subLocation;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.fetchSubLocationDetail = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "subLocations/getSubLocationById",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.form.subLocationId = response.data.id;
        $scope.form.subLocationName = response.data.name;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.releaseReserveAsset = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "asset/releaseReserveAsset",
    }).then(
      function successCallback(response) {
        Swal.fire({
          text: "Asset Released",
          icon: "success",
          buttonsStyling: !1,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });

        showHideLoad(true);
        autoAssetListFetch();
      },
      function errorCallback(response) {
        // //console.log(response.statusText);
      }
    );
  };

  $scope.SaveChnageStatus = function () {
    if ($scope.form.type == "Assigned") {
      if (
        $scope.form.employeeId == null ||
        $scope.form.employeeId == undefined
      ) {
        Swal.fire(
          "Please Select Employee",
          "You need to select employee for this asset.",
          "warning"
        );
        return;
      }
    }
    console.log($scope.form);
    showHideLoad();
    var method = "PUT";
    var url = "asset/updateAssetStatus";
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
    $("#edit_asset_status_modal").modal("hide");
    $("#edit_location_modal").modal("hide");
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


  $scope.form = {};
  $scope.subLocations = {};
  $scope.employeies = {};
  $scope.suppliers = {};
  $scope.locations = {};


  $scope.outOfService = function (id, type) {
    $scope.form = {};
    $scope.subLocations = {};
    $scope.employeies = {};
    $scope.suppliers = {};
    $scope.locations = {};
    if (type == 'Sale') {
      $scope.form = {};
      $scope.fetchEmployeies();
      $scope.form.id = id;
      $scope.form.type = type;
      $scope.fetchLocation();
      $scope.getSaleValue(id);
      $("#Asset_Disposition").modal("show");
    }
    else if (type == 'Rent') {
      $scope.form = {};
      $scope.form.id = id;
      $scope.form.type = type;
      $("#Asset_Rent").modal("show");
    }
    else {

      $scope.form = {};
      $scope.form.id = id;
      $scope.fetchLocation();
      $("#Asset_Disposition").modal("show");

    }
  }

  $scope.assetDispositionSave = function () {
    showHideLoad();
    $http({
      method: "PUT",
      params: { id: $scope.form.id, type: $scope.form.type, buyerType: $scope.form.buyerType, buyer: $scope.form.buyer, empId: $scope.form.employeeId, note: $scope.form.note, location: $scope.form.locationName, subLocation: $scope.form.subLocation, date: $scope.form.date, soldValue: $scope.form.soldValue },
      url: "asset/updateAssetStatusToOutOfService",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        autoAssetListFetch();
        $("#Asset_Disposition").modal("hide");
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


  $scope.getSaleValue = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "asset/getAssetSalesValue",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        $scope.form.soldValuePresent = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        $scope.form.soldValuePresent = response.data;
        // //console.log(response.statusText);
      }
    );
  };


  $scope.assetRenting = function () {
    console.log($scope.form);
    showHideLoad();
    $http({
      method: "PUT",
      params: { id: $scope.form.id, type: $scope.form.type, note: $scope.form.note, startDate: $scope.form.startDate, endDate: $scope.form.endDate },
      url: "asset/updateAssetRenting",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        autoAssetListFetch();
        $("#Asset_Rent").modal("hide");
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


  $scope.returnAsset = function (id) {
    showHideLoad();
    $http({
      method: "PUT",
      params: { id: id },
      url: "asset/assetReturn",
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

        showHideLoad(true);
        autoAssetListFetch();
      },
      function errorCallback(response) {
        // //console.log(response.statusText);
      }
    );
  };

  $scope.saveUpdateLocation = function () {
    showHideLoad();
    var method = "PUT";
    var url = "asset/locationUpdate";
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


  $scope.uploadFile = function (file, type) {
    var form_data = new FormData;
    form_data.append('module', type);
    form_data.append("file", file);
    console.log(form_data);
    console.log(file);
    console.log(type);

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
        $scope.form.link = response.data;
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
  $scope.downloadFile = function (link) {
    showHideLoad();
    $http({
      method: 'GET',
      params: { 'link': link },
      responseType: 'arraybuffer',
      url: 'upload/getFile'

    }).then(function successCallback(response) {
      console.log(response.data);
      var file = new Blob([response.data], { type: 'application/excel' });
      var fileURL = URL.createObjectURL(file);
      var a = document.createElement('a');
      a.href = fileURL;
      a.target = '_blank';
      a.download = link;
      document.body.appendChild(a);
      a.click();
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
      })
      showHideLoad(true);
    });
  }

  $scope.changeView = function (view) {
    if (view == "add" || view == "list" || view == "show") {
      $scope.form = {};
    }
    $scope.views.add = false;
    $scope.views.edit = false;
    $scope.views.list = false;
    $scope.views.show = false;
    $scope.views[view] = true;
  };
}
);

app.controller("AssetProjectManagementController", function ($scope, $http, $timeout, DTOptionsBuilder) {
  $scope.form = {};
  $scope.views = {};
  $scope.views.list = true;
  $scope.currentPage = 0;
  $scope.totalPages = 1;
  $scope.pageSize = 10;
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
      url: "asset/getAssetsForProjectManagement",
    }).then(
      function successCallback(response) {
        console.log(response);
        $scope.assets = response.data;
        $scope.assets.forEach(function (asset) {
          asset.select = false;
        });
        $scope.assets.select = false;
        $scope.changeView("list");
        // $scope.fetchProjectMaster();
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  }


  $scope.selectActionForAssign = function () {
    console.log($scope.assets.select);
    // Toggle the global select property for all assets
    $scope.assets.select = !$scope.assets.select;

    // Toggle the select property for each individual asset
    $scope.assets.forEach(function (asset) {
      if (asset.status == 'Active') {
        asset.select = $scope.assets.select;
      }
    });
    console.log($scope.assets);
  };


  $scope.selectActionForReturn = function () {
    console.log($scope.assets.select);
    // Toggle the global select property for all assets
    $scope.assets.select = !$scope.assets.select;

    // Toggle the select property for each individual asset
    $scope.assets.forEach(function (asset) {
      if (asset.status == 'Project') {
        asset.select = $scope.assets.select;
      }
    });
    console.log($scope.assets);
  };



  $scope.fetchProjectMaster = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "projectMaster/getProjectMasters",
    }).then(
      function successCallback(response) {
        console.log(response.data);
        $scope.projects = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };


  $scope.assetDeploy = function (id) {
    $scope.form = {};
    $scope.fetchProjectMaster();
    $scope.form.assetId = id;
    $scope.form.type = false;
    $("#edit_asset_status_modal").modal("show");
  }

  $scope.assetDeployMulti = function () {
    $scope.form = {};
    $scope.fetchProjectMaster();
    var ids = [];
    $scope.assets.forEach(function (asset) {
      if (asset.select == true && asset.status == 'Active') {
        ids.push(asset.id);
      }
    });
    $scope.form.assetIds = ids;
    $scope.form.type = true;
    if ($scope.form.assetIds.length > 0 && $scope.form.type == true) {
      $("#edit_asset_status_modal").modal("show");
    }
    else {
      Swal.fire({
        text: "Please Select",
        icon: "error",
        buttonsStyling: !1,
        confirmButtonText: "Ok, got it!",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      });
    }
  }

  $scope.SaveChangeStatus = function () {
    console.log($scope.form);
    showHideLoad();
    var method = "PUT";
    var url = "asset/updateAssetForProject";
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
    $("#edit_asset_status_modal").modal("hide");
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


  $scope.assetReturn = function (id) {
    var ids = [];
    ids.push(id);
    Swal.fire({
      title: "Receive Date",
      html: '<input type="text" id="yearInput" placeholder="Select Year" class="form-control">',
      showCancelButton: true,
      didOpen: () => {
        $("#yearInput").flatpickr({
          dateFormat: 'Y-m-d',
          allowInput: true,
          disableMobile: true
        });
      },
      preConfirm: () => {
        const yearInput = document.getElementById('yearInput').value;
        if (!yearInput) {
          Swal.showValidationMessage('Please select a year');
        }
        return yearInput;
      }
    }).then((result) => {
      if (result.value) {
        console.log("Result: " + result.value);
        showHideLoad();
        $http({
          method: 'PUT',
          params: { 'id': ids, 'date': result.value },
          url: 'asset/updateAssetForProjectReturn',
          headers: {
            'Content-Type': 'application/json'
          },
          transformResponse: angular.identity

        }).then(function successCallback(response) {
          console.log(response.data);
          autoAssetListFetch();
          Swal.fire(
            'success!',
            response.data,
            'success'
          )
          showHideLoad(true);
        }, function errorCallback(response) {
          autoAssetListFetch();
          Swal.fire(
            'Error!',
            response.data,
            'error'
          )
          // console.log(response.statusText);
          showHideLoad(true);
        });
      }
    });

  }

  $scope.assetsReturn = function () {
    var ids = [];
    $scope.assets.forEach(function (asset) {
      if (asset.select == true) {
        ids.push(asset.id);
      }
    });
    Swal.fire({
      title: "Receive Date",
      html: '<input type="text" id="yearInput" placeholder="Select Year" class="form-control">',
      showCancelButton: true,
      didOpen: () => {
        $("#yearInput").flatpickr({
          dateFormat: 'Y-m-d',
          allowInput: true,
          disableMobile: true
        });
      },
      preConfirm: () => {
        const yearInput = document.getElementById('yearInput').value;
        if (!yearInput) {
          Swal.showValidationMessage('Please select a year');
        }
        return yearInput;
      }
    }).then((result) => {
      if (result.value) {
        console.log("Result: " + result.value);
        showHideLoad();
        $http({
          method: 'PUT',
          params: { 'id': ids, 'date': result.value },
          url: 'asset/updateAssetForProjectReturn',
          headers: {
            'Content-Type': 'application/json'
          },
          transformResponse: angular.identity

        }).then(function successCallback(response) {
          console.log(response.data);
          autoAssetListFetch();
          Swal.fire(
            'success!',
            response.data,
            'success'
          )
          showHideLoad(true);
        }, function errorCallback(response) {
          autoAssetListFetch();
          Swal.fire(
            'Error!',
            response.data,
            'error'
          )
          // console.log(response.statusText);
          showHideLoad(true);
        });
      }
    });

  }

  $scope.changeView = function (view) {
    if (view == "add" || view == "list" || view == "show") {
      $scope.form = {};
    }
    $scope.views.add = false;
    $scope.views.edit = false;
    $scope.views.list = false;
    $scope.views.show = false;
    $scope.views[view] = true;
  };
}
);

app.controller("CallLogController", function ($scope, $http, $timeout, DTOptionsBuilder) {
  $scope.form = {};
  $scope.subform = {};
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

  autoCallLogListFetch();
  function autoCallLogListFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "CallLog/getCallLog",
    }).then(
      function successCallback(response) {
        console.log(response);
        $scope.logs = response.data;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  }

  $scope.disMissCallLog = function (id) {
    showHideLoad();
    $http({
      method: "PUT",
      params: { id: id },
      url: "CallLog/disMissCallLog",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        //console.log(response.data);
        autoCallLogListFetch();
        Swal.fire({
          text: response.data,
          icon: "success",
          buttonsStyling: !1,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
        showHideLoad(true);
      },
      function errorCallback(response) {
        Swal.fire({
          text: response.data,
          icon: "error",
          buttonsStyling: !1,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary"
          }
        })
        //console.log(response.statusText);
      }
    );
  };

  $scope.assignService = function (id) {
    $scope.form = {};
    $scope.form.id = id;
    $scope.fetchServiceEngineer();
    $("#Assign_Log").modal("show");

  }

  $scope.AssignServiceEngg = function () {
    angular.forEach($scope.engineers, function (value, key) {
      if (value.id = $scope.form.id) {
        $scope.form.engineerName = value.name
      }

    });
    showHideLoad();
    $http({
      method: "PUT",
      params: { "id": $scope.form.id, "priority": $scope.form.priority, "engineerName": $scope.form.engineerName, "engineer": $scope.form.engineer },
      url: "CallLog/logAssign",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        autoCallLogListFetch();
        $("#Assign_Log").modal("hide");
        Swal.fire({
          text: response.data,
          icon: "success",
          buttonsStyling: !1,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
        showHideLoad(true);
      },
      function errorCallback(response) {
        Swal.fire({
          text: response.data,
          icon: "error",
          buttonsStyling: !1,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary"
          }
        })
        //console.log(response.statusText);
      }
    );
  };


  $scope.fetchServiceEngineer = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "user/getServiceEngineer",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.engineers = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };


  $scope.editAssetStatus = function (callId, id, type) {
    $scope.form = {};
    $scope.form.assetId = id;
    $scope.form.callId = callId;
    $scope.form.type = type;
    $scope.suppliers = {};
    //console.log($scope.form);
    if (type == "Maintenance") {
      $scope.fetchSuppliers();
    }
    $("#edit_asset_status_modal").modal("show");
  };


  $scope.fetchSuppliers = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "supplier/getServies",
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

  $scope.fetchSupplierDetail = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "supplier/getSupplierById",
    }).then(
      function successCallback(response) {
        $scope.form.supplierName = response.data.name;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };


  $scope.SaveChnageStatus = function () {
    // console.log($scope.form);
    showHideLoad();
    var method = "PUT";
    var url = "asset/updateAssetStatus";
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
    $("#edit_asset_status_modal").modal("hide");
    autoCallLogListFetch();
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
    $scope.views.edit = false;
    $scope.views.list = false;
    $scope.views[view] = true;
  };
}
);

app.controller("ServiceRegister", function ($scope, $http, $timeout, DTOptionsBuilder) {
  $scope.form = {};
  $scope.subform = {};
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

  autoCallLogListFetch();
  function autoCallLogListFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "CallLog/getCallLogForEngg",
    }).then(
      function successCallback(response) {
        console.log(response);
        $scope.logs = response.data;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  }

  $scope.serviceAcceleration = function (id) {
    Swal.fire({
      title: "Resolve Issue",
      html: `
          <input type="text" id="reasonInput" placeholder="Enter Reason" class="form-control" required>
      `,
      showCancelButton: true,
      preConfirm: () => {
        const reasonInput = document.getElementById('reasonInput').value;

        if (!reasonInput.trim()) {
          Swal.showValidationMessage('Please enter a valid reason');
          return false;
        }

        return reasonInput.trim();
      }
    }).then((result) => {
      if (result.value) {
        showHideLoad();
        $http({
          method: 'PUT',
          params: { 'id': id, 'reason': result.value },
          url: 'CallLog/serviceAcceleration',
          headers: {
            'Content-Type': 'application/json'
          },
          transformResponse: angular.identity

        }).then(function successCallback(response) {
          autoCallLogListFetch();
          Swal.fire({
            text: response.data,
            icon: "success",
            buttonsStyling: !1,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
          showHideLoad(true);
        }, function errorCallback(response) {
          Swal.fire(
            'Error!',
            response.data,
            'error'
          )
          autoCallLogListFetch();
          console.log(response.statusText);
        });
      }
    });
  }

  $scope.resolve = function (id) {
    showHideLoad();
    $http({
      method: 'PUT',
      params: { 'id': id },
      url: 'CallLog/serviceResolve',
      headers: {
        'Content-Type': 'application/json'
      },
      transformResponse: angular.identity

    }).then(function successCallback(response) {
      autoCallLogListFetch();
      Swal.fire({
        text: response.data,
        icon: "success",
        buttonsStyling: !1,
        confirmButtonText: "Ok, got it!",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      });
      showHideLoad(true);
    }, function errorCallback(response) {
      Swal.fire(
        'Error!',
        response.data,
        'error'
      )
      autoCallLogListFetch();
      console.log(response.statusText);
    });
  }


  $scope.assignService = function (id) {
    $scope.form = {};
    $scope.form.id = id;
    $scope.fetchServiceEngineer();
    $("#Assign_Log").modal("show");

  }

  $scope.AssignServiceEngg = function () {
    angular.forEach($scope.engineers, function (value, key) {
      if (value.id = $scope.form.id) {
        $scope.form.engineerName = value.name
      }

    });
    showHideLoad();
    $http({
      method: "PUT",
      params: { "id": $scope.form.id, "priority": $scope.form.priority, "engineerName": $scope.form.engineerName, "engineer": $scope.form.engineer },
      url: "CallLog/logAssign",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        autoCallLogListFetch();
        $("#Assign_Log").modal("hide");
        Swal.fire({
          text: response.data,
          icon: "success",
          buttonsStyling: !1,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
        showHideLoad(true);
      },
      function errorCallback(response) {
        Swal.fire({
          text: response.data,
          icon: "error",
          buttonsStyling: !1,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary"
          }
        })
        //console.log(response.statusText);
      }
    );
  };


  $scope.fetchServiceEngineer = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "user/getServiceEngineer",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.engineers = response.data;
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
