var app = angular.module("AdminManagment", ["datatables","datatables.buttons",]);

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

app.controller("LocationController", function ($scope, $http, $timeout, DTOptionsBuilder) {
  $scope.form = {};
  $scope.rows = [{ name: '' }];
  $scope.subform = {};
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
            title: "Location",
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
            title: "Location",
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
            title: "Location",
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

  autoLocationListFetch();
  function autoLocationListFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "locations/getAllLocations",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.locations = response.data;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  }

  $scope.AddLocation = function () {
    $scope.form = {};
    $("#add_edit_location_modal").modal("show");
  };

  $scope.addEditSaveLocation = function () {
    //console.log($scope.form);
    showHideLoad();
    if ($scope.form.id == "" || $scope.form.id == undefined) {
      var method = "POST";
      var url = "locations/createLocation";
    } else {
      var method = "PUT";
      var url = "locations/updateLocation";
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
    $("#add_edit_location_modal").modal("hide");
    $("#add_subLocation_modal").modal("hide");
    $("#edit_subLocation_modal").modal("hide");
    autoLocationListFetch();
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

  $scope.editLocation = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "locations/getLocationById",
    }).then(
      function successCallback(response) {
        //console.log(response.data);
        $scope.form = response.data;
        $("#add_edit_location_modal").modal("show");
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
      url: "locations/toggleLocationStatus",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        //console.log(response.data);
        autoLocationListFetch();
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.addSubLocation = function (id) {
    $scope.rows = [{ locId: id, name: '' }];
    $scope.LocationId = id;
    $("#add_subLocation_modal").modal("show");
  };

  $scope.addRow = function () {
    $scope.rows.push({ locId: $scope.LocationId, name: '' });
  };

  $scope.removeRow = function (index) {
    $scope.rows.splice(index, 1);
  };

  $scope.addSaveSubLocation = function () {
    console.log($scope.rows);
    showHideLoad();
    var method = "POST";
    var url = "subLocations/createSubLocation";
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

  $scope.editSaveSubLocation = function () {
    showHideLoad();
    var method = "PUT";
    var url = "subLocations/updateSubLocation";
    $http({
      method: method,
      url: url,
      data: angular.toJson($scope.subform),
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(_success, _error);
  };

  $scope.fetchAllSubLocation = function (id, subLoc) {
    $scope.loc_id = id;
    $scope.subLocs = subLoc;
    $("#show_subloc_modal").modal("show");
  };

  $scope.editSubLocation = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "subLocations/getSubLocationById",
    }).then(
      function successCallback(response) {
        $("#show_subloc_modal").modal("hide");
        //console.log(response.data);
        $scope.subform = response.data;
        $("#edit_subLocation_modal").modal("show");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.changeSubCatStatus = function (id) {
    showHideLoad();
    $http({
      method: "DELETE",
      params: { id: id },
      url: "subLocations/toggleSubLocationStatus",
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

app.controller("DepartmentController", function ($scope, $http, $timeout, DTOptionsBuilder) {
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
      {
        extend: "colvis",
        text: '<span class="lbl-dropdown">Columns</span><span class="icon-common icon-btn-dropdown icon-chevron"></span>',
      },

    ]);

  autoDepartmentListFetch();
  function autoDepartmentListFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "department/getAllDepartment",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.departments = response.data;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  }

  $scope.AddDepartment = function () {
    $scope.form = {};
    $("#add_edit_dept_modal").modal("show");
  };

  $scope.addEditSaveDepartment = function () {
    //console.log($scope.form);
    showHideLoad();
    if ($scope.form.id == "" || $scope.form.id == undefined) {
      var method = "POST";
      var url = "department/createDepartment";
    } else {
      var method = "PUT";
      var url = "department/updateDepartment";
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
    autoDepartmentListFetch();
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
  $scope.editDepartment = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "department/getDepartmentById",
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
      url: "department/toggleDepartmentStatus",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        //console.log(response.data);
        autoDepartmentListFetch();
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.addRole = function (id) {
    $scope.form.depId = id;
    $("#add_roles_modal").modal("show");
  };
  $scope.addSaveRole = function () {
    //console.log($scope.form);
    showHideLoad();

    var method = "POST";
    var url = "jobRole/createJobRole";
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

  $scope.fetchAllRoles = function (id, roles) {
    $scope.department_id = id;
    $scope.roles = roles;
    $("#show_roles_modal").modal("show");
  };
  $scope.editDepartmentRole = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "jobRole/getJobRoleById",
    }).then(
      function successCallback(response) {
        $("#show_roles_modal").modal("hide");
        //console.log(response.data);
        $scope.form = response.data;
        $("#add_roles_modal").modal("show");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };
  $scope.changeRoleStatus = function (id) {
    showHideLoad();
    $http({
      method: "DELETE",
      params: { id: id },
      url: "jobRole/toggleJobRoleStatus",
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

app.controller("ManufacturerController", function ($scope, $http, $timeout, DTOptionsBuilder) {
  $scope.form = {};
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
            title: "Manufacturer",
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
            title: "Manufacturer",
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
            title: "Manufacturer",
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

  autoManufacturerListFetch();
  function autoManufacturerListFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "manufacturer/getAllManufacturer",
    }).then(
      function successCallback(response) {
        // console.log(response);
        $scope.manufacturers = response.data;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  }

  $scope.AddManufacturer = function () {
    $scope.form = {};
    $("#add_edit_Manufacturer_modal").modal("show");
  };

  $scope.addEditSaveManufacturer = function () {
    //console.log($scope.form);
    showHideLoad();
    if ($scope.form.id == "" || $scope.form.id == undefined) {
      var method = "POST";
      var url = "manufacturer/createManufacturer";
    } else {
      var method = "PUT";
      var url = "manufacturer/updateManufacturer";
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
    $("#add_edit_Manufacturer_modal").modal("hide");
    autoManufacturerListFetch();
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
  $scope.editManufacturer = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "manufacturer/getManufacturerById",
    }).then(
      function successCallback(response) {
        //console.log(response.data);
        $scope.form = response.data;
        $("#add_edit_Manufacturer_modal").modal("show");
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
      url: "manufacturer/toggleManufacturerStatus",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        //console.log(response.data);
        autoManufacturerListFetch();
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

app.controller("ProjectMasterController", function ($scope, $http, $timeout, DTOptionsBuilder) {
  $scope.form = {};
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
            title: "Manufacturer",
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
            title: "Manufacturer",
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
            title: "Manufacturer",
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

  autoProjectListFetch();
  function autoProjectListFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "projectMaster/getAllProjectMaster",
    }).then(
      function successCallback(response) {
        // console.log(response);
        $scope.projects = response.data;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  }

  $scope.AddProject = function () {
    $scope.form = {};
    $("#add_edit_project_modal").modal("show");
  };

  $scope.addEditSaveProject = function () {
    //console.log($scope.form);
    showHideLoad();
    if ($scope.form.id == "" || $scope.form.id == undefined) {
      var method = "POST";
      var url = "projectMaster/createProjectMaster";
    } else {
      var method = "PUT";
      var url = "projectMaster/updateProjectMaster";
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
    $("#add_edit_project_modal").modal("hide");
    autoProjectListFetch();
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
  $scope.editProject = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "projectMaster/getProjectMasterById",
    }).then(
      function successCallback(response) {
        //console.log(response.data);
        $scope.form = response.data;
        $("#add_edit_project_modal").modal("show");
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
      url: "projectMaster/toggleProjectMasterStatus",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        //console.log(response.data);
        autoProjectListFetch();
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

app.controller("SupplierController", function ($scope, $http, $timeout, DTOptionsBuilder) {
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
            title: "Supplier",
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
            title: "Supplier",
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
            title: "Supplier",
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

  autoSupplierListFetch();
  function autoSupplierListFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "supplier/getAllSupplier",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.suppliers = response.data;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  }

  $scope.AddSupplier = function () {
    $scope.form = {};
    $("#add_edit_supplier_modal").modal("show");
  };

  $scope.uploadModal = function () {
    $scope.form = {};
    $("#upload_modal").modal("show");
};

$scope.downloadExcel = function (type) {
  showHideLoad();
  $http({
      method: 'GET',
      params: { 'type': type },
      responseType: 'arraybuffer',
      url: 'excel/getSuplierTemplate'
  }).then(function successCallback(response) {
      var contentDisposition = response.headers('Content-Disposition');
      var filename = extractFilenameFromContentDisposition(contentDisposition);

      var blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

      // Trigger file download
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename || 'asset_template.xlsx'; // Use filename from headers or default to 'asset_template.xlsx'
      link.click();
      $scope.form.activeUpload = true;
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

  $scope.addEditSaveSupplier = function () {
    //console.log($scope.form);
    showHideLoad();
    if ($scope.form.id == "" || $scope.form.id == undefined) {
      var method = "POST";
      var url = "supplier/createSupplier";
    } else {
      var method = "PUT";
      var url = "supplier/updateSupplier";
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

  $scope.editSupplier = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "supplier/getSupplierById",
    }).then(
      function successCallback(response) {
        //console.log(response.data);
        $scope.form = response.data;
        $("#add_edit_supplier_modal").modal("show");
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
      url: "supplier/toggleSupplierStatus",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        //console.log(response.data);
        autoSupplierListFetch();
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  function _success(response) {
    showHideLoad(true);
    $("#add_edit_supplier_modal").modal("hide");
    autoSupplierListFetch();
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

  $scope.uploadExcel = function (data) {
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
          form_data.append("type", "StockAdjustExcel");
          form_data.append("file", data);
          var config = {
            transformResponse: angular.identity,
            headers: {
              "Content-Type": undefined,
            },
          };
          var url = "common/uploadExcelForSupplier";

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

app.controller("EmployeeController", function ($scope, $http, $timeout, DTOptionsBuilder) {
  $scope.form = {};
  $scope.views = {};
  $scope.views.list = true;
  $scope.excelFile = "";
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

  autoEmployeeListFetch();
  function autoEmployeeListFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "employee/getAllEmployee",
    }).then(
      function successCallback(response) {
        console.log(response);
        $scope.employees = response.data;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  }

  $scope.AddEmployee = function () {
    $scope.form = {};
    $scope.fetchDepartment();
    $("#add_edit_employee_modal").modal("show");
  };

  $scope.uploadModal = function () {
    $scope.form = {};
    $("#upload_modal").modal("show");
};

$scope.downloadExcel = function (type) {
  showHideLoad();
  $http({
      method: 'GET',
      params: { 'type': type },
      responseType: 'arraybuffer',
      url: 'excel/getEmployeesTemplate'
  }).then(function successCallback(response) {
      var contentDisposition = response.headers('Content-Disposition');
      var filename = extractFilenameFromContentDisposition(contentDisposition);

      var blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

      // Trigger file download
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename || 'asset_template.xlsx'; // Use filename from headers or default to 'asset_template.xlsx'
      link.click();
      $scope.form.activeUpload = true;
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

  $scope.uploadExcel = function (data) {
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
          form_data.append("type", "StockAdjustExcel");
          form_data.append("file", data);
          var config = {
            transformResponse: angular.identity,
            headers: {
              "Content-Type": undefined,
            },
          };
          var url = "common/uploadExcelForEmp";

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

  $scope.fetchDepartment = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      url: "department/getAllDepartment",
    }).then(
      function successCallback(response) {
        $scope.departments = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.addEditEmployee = function () {
    //console.log($scope.form);
    showHideLoad();
    if ($scope.form.id == "" || $scope.form.id == undefined) {
      var method = "POST";
      var url = "employee/createEmployee";
    } else {
      var method = "PUT";
      var url = "employee/updateEmployee";
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
    $("#add_edit_employee_modal").modal("hide");
    autoEmployeeListFetch();
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
  $scope.editEmployee = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "employee/getEmployeeById",
    }).then(
      function successCallback(response) {
        // //console.log(response.data);
        $scope.form = response.data;
        $scope.fetchDepartment();
        $("#add_edit_employee_modal").modal("show");
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
      url: "employee/toggleEmployeeStatus",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        //console.log(response.data);
        // autoEmployeeListFetch();
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };


$scope.uploadFile = function (file) {
  var form_data = new FormData;
  form_data.append('module', 'user');
  form_data.append("file", file);

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
      $scope.form.imageLink = response.data;
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
    $scope.views.edit = false;
    $scope.views.list = false;
    $scope.views[view] = true;
  };
}
);