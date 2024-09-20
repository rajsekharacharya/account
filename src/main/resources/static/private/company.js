var app = angular.module("CompanyManagment", []);

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

app.controller("DashboardController", function ($scope, $http, $timeout) {
  // Process the JSON data into a format suitable for Chart.js
  $scope.BarChartData = {
    labels: [], // x-axis labels (status)
    datasets: [
      {
        label: "Working",
        backgroundColor: [],
        hoverBackgroundColor: [],
        data: [], // Working data
        borderWidth: 0,
        borderRadius: 5,
        maxBarThickness: 100,
      },
    ],
  };

  $scope.DoughnutChartData = {
    labels: [], // department names
    datasets: [
      {
        data: [], // TotalWorking data
        backgroundColor: [], // Random colors for each department
        hoverBackgroundColor: [],
        label: "# of Votes",
        borderWidth: 1,
        maxBarThickness: 25,
      },
    ],
  };

  autoLocationListFetch();
  function autoLocationListFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "dashboardAdmin/getDashboardForSAAS",
    }).then(
      function successCallback(response) {
        // console.log(response);
        $scope.data = response.data;

        $scope.data.CompanyAssetData.forEach((item) => {
          $scope.BarChartData.labels.push(item.Company);
          $scope.BarChartData.datasets[0].data.push(item.assetCount);
          const randomColor = getRandomColor();
          $scope.BarChartData.datasets[0].backgroundColor.push(randomColor);
          $scope.BarChartData.datasets[0].hoverBackgroundColor.push(
            randomColor
          );
        });
        // Create the chart after processing the data

        $scope.data.PlanSummery.forEach((item) => {
          $scope.DoughnutChartData.labels.push(item.plan_name);
          $scope.DoughnutChartData.datasets[0].data.push(item.total);

          // Generate a random color for each department
          const randomColor = getRandomColor();
          $scope.DoughnutChartData.datasets[0].backgroundColor.push(
            randomColor
          );
          $scope.DoughnutChartData.datasets[0].hoverBackgroundColor.push(
            randomColor
          );
        });

        createChart();
        showHideLoad(true);
      },
      function errorCallback(response) {
        // Handle error
        console.log(response.statusText);
      }
    );
  }

  function getRandomColor() {
    const colors = [
      "#8E86ED",
      "#B4D5A9",
      "#63CDEE",
      "#CA78C6",
      "#8EDFE4",
      "#EEAE4D",
      "#E98787",
      "#6A7DE2",
      "#EE6363",
      "#EE914D",
      "#F3BD32",
      "#ED86AB",
      "#058CD8",
      "#DC8C13",
      "#3D8F29",
      "#7C5A03",
      "#7C3603",
      "#D6691B",
      "#007DA5",
      "#219983",
      "#B54179",
      "#762A2A",
      "#B46A8D",
      "#CE7A68",
      "#24477B",
      "#219951",
      "#A885C5",
      "#B2AA59",
      "#AAC65A",
      "#3BBDE5",
    ];

    // Generate a random index to pick a color from the list
    const randomIndex = Math.floor(Math.random() * colors.length);

    return colors[randomIndex];
  }

  // Function to create the Chart.js chart
  function createChart() {
    const ctx = document.getElementById("myBarChart").getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: $scope.BarChartData,
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            // Additional Y-axis options can be added here
          },
          x: {
            // Additional X-axis options can be added here
          },
        },
        plugins: {
          legend: {
            display: false, // Hide the legend
          },
        },
      },
    });

    const ctx1 = document.getElementById("myDoughnutChart");

    new Chart(ctx1, {
      type: "doughnut",
      data: $scope.DoughnutChartData,
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            border: {
              display: false, // base line
            },
            grid: {
              display: false, //to hide vartical lines
              drawTicks: false,
            },
            ticks: {
              display: false, //this will show / remove only the label
            },
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 12,
              padding: 15,
            },
          },
        },
      },
    });
  }
});

app.controller("SubscriptionController", function ($scope, $http, $timeout) {
  $scope.form = {};
  $scope.views = {};
  $scope.views.list = true;
  $scope.expiry_state = 0;
  autoSubscriptionListFetch();
  function autoSubscriptionListFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "subscription-plan-master/getSubscriptionPlanMaster",
    }).then(
      function successCallback(response) {
        console.log(response);
        $scope.subscriptions = response.data;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  }

  $scope.AddSubscription = function () {
    $scope.changeView("add");
  };

  $scope.addSaveSubscription = function () {
    showHideLoad();
    var method = "POST";
    var url = "subscription-plan-master/createSubscriptionPlanMaster";
    console.log($scope.form);
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
    $("#subscription_modal").modal("hide");
    autoSubscriptionListFetch();
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

  $scope.editSubscription = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "subscription-plan-master/getSubscriptionPlanMasterById",
    }).then(
      function successCallback(response) {
        console.log(response.data);
        $scope.form = response.data;
        $scope.form.mobileAccess = String(response.data.mobileAccess);
        $scope.form.docUpload = String(response.data.docUpload);
        $("#subscription_modal").modal("show");
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };

  $scope.editSaveSubscription = function () {
    console.log($scope.form);
    showHideLoad();

    var method = "PUT";
    var url = "subscription-plan-master/updateSubscriptionPlanMaster";
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

  $scope.changeView = function (view) {
    if (view == "add" || view == "list" || view == "show") {
      $scope.form = {};
    }
    $scope.views.add = false;
    $scope.views.edit = false;
    $scope.views.list = false;
    $scope.views[view] = true;
  };
});

app.controller("SuperAdminController", function ($scope, $http, $timeout) {
  $scope.form = {};
  $scope.views = {};
  $scope.views.list = true;

  $scope.showPassword = false;

  $scope.togglePassword = function () {
    $scope.showPassword = !$scope.showPassword;
  };

  autoAdminListFetch();
  function autoAdminListFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "user/getSuperAdmin",
    }).then(
      function successCallback(response) {
        console.log(response);
        $scope.admins = response.data;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  }

  $scope.AddAdmin = function () {
    $scope.fetchCompanies();
    $("#add_edit_user_modal").modal("show");
    $("#user-name-error").hide();
    $("#user-name-error-edit").hide();
  };

  $scope.fetchCompanies = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "SuperCompanies/getSuperCompanies",
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

  $scope.changeStatus = function (id) {
    showHideLoad();
    $http({
      method: "PUT",
      params: { id: id },
      url: "user/accountStatusToggle",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        console.log(response.data);
        autoAdminListFetch();
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };
  $scope.changeExpiryStatus = function (id) {
    showHideLoad();
    $http({
      method: "PUT",
      params: { id: id },
      url: "user/accountExpiryToggle",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        console.log(response.data);
        autoAdminListFetch();
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };

  $scope.addEditUser = function () {
    //console.log($scope.form);
    showHideLoad();
    if ($scope.form.id == "" || $scope.form.id == undefined) {
      var method = "POST";
      var url = "user/creatSuperAdmin";
    } else {
      var method = "PUT";
      var url = "user/updateUser";
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
    autoAdminListFetch();
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
  $scope.editAdmin = function (id) {
    $scope.fetchCompanies();
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "user/userGetById",
    }).then(
      function successCallback(response) {
        $scope.form = response.data;
        $("#add_edit_user_modal").modal("show");
        $("#user-name-error").hide();
        $("#user-name-error-edit").hide();
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };

  $scope.uploadFile = function (file) {
    var form_data = new FormData();
    form_data.append("module", "user");
    form_data.append("file", file);

    var config = {
      transformResponse: angular.identity,
      headers: {
        "Content-Type": undefined,
      },
    };
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
            confirmButton: "btn btn-primary",
          },
        });
      },
      // Error
      function (response) {
        Swal.fire({
          text: "File Upload failed! Please Upload Again",
          icon: "error",
          buttonsStyling: !1,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
        console.log(response);
      }
    );
  };

  $scope.checkUserNameAvailability = function (username) {
    showHideLoad();
    $http({
      method: "GET",
      params: { username: username },
      url: "user/usernameAvailability",
    }).then(
      function successCallback(response) {
        console.log(response.data);
        if (response.data == false) {
          $("#user-name-error").hide();
          $("#user-name-error-edit").hide();
        } else {
          $("#user-name-error").show();
          $("#user-name-error-edit").show();
        }
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };
  $scope.checkEmailAvailability = function (email) {
    showHideLoad();
    $http({
      method: "GET",
      params: { email: email },
      url: "user/emailAvailability",
    }).then(
      function successCallback(response) {
        console.log(response.data);
        if (response.data == false) {
          $("#email-error").hide();
          $("#email-error-edit").hide();
        } else {
          $("#email-error").show();
          $("#email-error-edit").show();
        }
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };

  $scope.deleteAdmin = function (id) {
    Swal.fire({
      title: "Are you sure?",
      text: "you want to delete this Data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        showHideLoad();
        var method = "DELETE";
        var url = "user/deleteUser";
        $http({
          method: method,
          params: { id: id },
          url: url,
          headers: {
            "Content-Type": "application/json",
          },
          transformResponse: angular.identity,
        }).then(_success, _error);
      }
    });
  };

  $scope.changeView = function (view) {
    if (view == "add" || view == "list" || view == "show") {
      $("#user-name-error").hide();
      $scope.form = {};
    }
    if (view == "edit") {
      $("#user-name-error-edit").hide();
    }
    $scope.views.add = false;
    $scope.views.edit = false;
    $scope.views.list = false;
    $scope.views[view] = true;
  };
});

app.controller("SuperCompanyController", function ($scope, $http, $timeout) {
  $scope.form = {};
  $scope.subscriptionsForm = {};
  $scope.subscriptions = {};
  $scope.companyName = "";
  $scope.companyId = "";
  $scope.views = {};
  $scope.countries = {};
  $scope.states = {};
  $scope.views.list = true;
  $scope.expiry_state = 0;

  autoCompanyListFetch();
  function autoCompanyListFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "SuperCompanies/getAllSuperCompanies",
    }).then(
      function successCallback(response) {
        console.log(response);
        $scope.companies = response.data;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  }
  $scope.fetchStates = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      url: "common/getState",
    }).then(
      function successCallback(response) {
        $scope.states = response.data;
        // console.log($scope.states);
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };

  $scope.fetchCoutry = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      url: "common/getCountry",
    }).then(
      function successCallback(response) {
        // console.log(response);
        $scope.countries = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };

  $scope.AddCompany = function () {
    $scope.changeView("add");
    $scope.fetchStates();
    $scope.fetchCoutry();
  };

  $scope.fetchSubscriptionControl = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "subscription-plans/getSubscriptionPlanByCompany",
    }).then(
      function successCallback(response) {
        console.log(response);
        $scope.subscriptions = response.data;
        $scope.expiry_state = 0;
        angular.forEach($scope.subscriptions, function (val, key) {
          if (val.status == true) {
            $scope.expiry_state = 1;
            $scope.start_date = val.startDate;
            $scope.end_date = val.endDate;
          }
        });
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };

  $scope.SubscriptionControl = function (id, name) {
    $scope.fetchSubscriptionControl(id);
    $scope.companyName = name;
    $scope.companyId = id;
    $scope.changeView("subscription");
  };

  $scope.changeSubscriptionStatus = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "subscription-plans/subscriptionPlanToggle",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        console.log(response.data);
        $scope.fetchSubscriptionControl($scope.companyId);
        $scope.changeView("subscription");
        showHideLoad(true);
      },
      function errorCallback(response) {
        Swal.fire("Error!", response.data, "error");
        $scope.fetchSubscriptionControl($scope.companyId);
        $scope.changeView("subscription");
        console.log(response.statusText);
      }
    );
  };

  $scope.extendSubscription = function (id) {
    Swal.fire({
      title: "Add Year",
      html: '<input type="number" id="yearInput" placeholder="Select Year" class="form-control">',
      showCancelButton: true,
      didOpen: () => {
        // Attach an input event listener to restrict input to integers
        const yearInput = document.getElementById("yearInput");
        yearInput.addEventListener("input", function () {
          this.value = this.value.replace(/[^0-9]/g, ""); // Allow only digits
        });
      },
      preConfirm: () => {
        const yearInput = document.getElementById("yearInput").value;
        if (
          !yearInput ||
          isNaN(yearInput) ||
          !Number.isInteger(parseFloat(yearInput))
        ) {
          Swal.showValidationMessage("Please enter a valid Number");
          return false;
        }
        return parseInt(yearInput, 10);
      },
    }).then((result) => {
      if (result.value) {
        console.log("Result: " + result.value);
        showHideLoad();
        $http({
          method: "GET",
          params: { id: id, year: result.value },
          url: "subscription-plans/subscriptionPlanExtension",
          headers: {
            "Content-Type": "application/json",
          },
          transformResponse: angular.identity,
        }).then(
          function successCallback(response) {
            console.log(response.data);
            $scope.fetchSubscriptionControl($scope.companyId);
            $scope.changeView("subscription");
            showHideLoad(true);
          },
          function errorCallback(response) {
            Swal.fire("Error!", response.data, "error");
            $scope.fetchSubscriptionControl($scope.companyId);
            $scope.changeView("subscription");
            console.log(response.statusText);
          }
        );
      }
    });
  };

  $scope.changeToggleSuperCompany = function (id) {
    showHideLoad();
    $http({
      method: "PUT",
      params: { id: id },
      url: "SuperCompanies/toggleSuperCompany",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        console.log(response.data);
        autoCompanyListFetch();
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };

  $scope.addSaveCompany = function () {
    showHideLoad();
    var method = "POST";
    var url = "SuperCompanies/createSuperCompany";
    console.log($scope.form);
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
    autoCompanyListFetch();
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
  $scope.editCompany = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "SuperCompanies/getSuperCompanyById",
    }).then(
      function successCallback(response) {
        console.log(response.data);
        $scope.form = response.data;
        $scope.fetchStates();
        $scope.fetchCoutry();
        $scope.changeView("edit");
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };
  $scope.editSaveCompany = function () {
    console.log($scope.form);
    showHideLoad();

    var method = "PUT";
    var url = "SuperCompanies/updateSuperCompany";
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
  $scope.deleteCompany = function (id) {
    Swal.fire({
      title: "Are you sure?",
      text: "you want to delete this Data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        showHideLoad();
        var method = "DELETE";
        var url = "companies/deleteCompany";
        $http({
          method: method,
          params: { id: id },
          url: url,
          headers: {
            "Content-Type": "application/json",
          },
          transformResponse: angular.identity,
        }).then(
          function successCallback(response) {
            console.log(response);
            showHideLoad(true);
            Swal.fire("Deleted!", response.data, "success");
            autoCompanyListFetch();
          },
          function errorCallback(response) {
            console.log(response);
          }
        );
      }
    });
  };

  $scope.editSubscription = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "subscription-plans/getSubscriptionPlanById",
    }).then(
      function successCallback(response) {
        console.log(response.data);
        $scope.subscriptionsForm = response.data;
        $scope.subscriptionsForm.mobileAccess = String(
          response.data.mobileAccess
        );
        $scope.changeView("subscriptionEdit");
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };

  $scope.editSaveSubscription = function () {
    showHideLoad();
    var method = "PUT";
    var url = "subscription-plans/updateSubscriptionPlan";
    $http({
      method: method,
      url: url,
      data: angular.toJson($scope.subscriptionsForm),
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        showHideLoad(true);
        Swal.fire({
          text: response.data,
          icon: "success",
          buttonsStyling: !1,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
        $scope.fetchSubscriptionControl($scope.companyId);
        $scope.changeView("subscription");
      },
      function errorCallback(response) {
        Swal.fire("Error!", response.data, "error");
        $scope.fetchSubscriptionControl($scope.companyId);
        $scope.changeView("subscription");
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
    $scope.views.subscription = false;
    $scope.views.subscriptionEdit = false;
    $scope.views[view] = true;
  };
});

app.controller("UserController", function ($scope, $http, $timeout) {
  $scope.form = {};
  $scope.views = {};
  $scope.views.list = true;

  $scope.showPassword = false;

  $scope.togglePassword = function () {
    $scope.showPassword = !$scope.showPassword;
  };

  autoAdminListFetch();
  function autoAdminListFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "user/getSaasUser",
    }).then(
      function successCallback(response) {
        console.log(response);
        $scope.admins = response.data;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  }

  $scope.AddAdmin = function () {
    $scope.form={};
    $("#add_edit_user_modal").modal("show");
    $("#user-name-error").hide();
    $("#user-name-error-edit").hide();
  };

  $scope.changeStatus = function (id) {
    showHideLoad();
    $http({
      method: "PUT",
      params: { id: id },
      url: "user/accountStatusToggle",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        console.log(response.data);
        autoAdminListFetch();
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };
  $scope.changeExpiryStatus = function (id) {
    showHideLoad();
    $http({
      method: "PUT",
      params: { id: id },
      url: "user/accountExpiryToggle",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        console.log(response.data);
        autoAdminListFetch();
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };

  $scope.addEditUser = function () {
    //console.log($scope.form);
    showHideLoad();
    if ($scope.form.id == "" || $scope.form.id == undefined) {
      var method = "POST";
      var url = "user/creatSaasUser";
    } else {
      var method = "PUT";
      var url = "user/updateUser";
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
    autoAdminListFetch();
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
  $scope.editAdmin = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "user/userGetById",
    }).then(
      function successCallback(response) {
        $scope.form = response.data;
        $("#add_edit_user_modal").modal("show");
        $("#user-name-error").hide();
        $("#user-name-error-edit").hide();
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };

  $scope.checkUserNameAvailability = function (username) {
    showHideLoad();
    $http({
      method: "GET",
      params: { username: username },
      url: "user/usernameAvailability",
    }).then(
      function successCallback(response) {
        console.log(response.data);
        if (response.data == false) {
          $("#user-name-error").hide();
          $("#user-name-error-edit").hide();
        } else {
          $("#user-name-error").show();
          $("#user-name-error-edit").show();
        }
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };
  $scope.checkEmailAvailability = function (email) {
    showHideLoad();
    $http({
      method: "GET",
      params: { email: email },
      url: "user/emailAvailability",
    }).then(
      function successCallback(response) {
        console.log(response.data);
        if (response.data == false) {
          $("#email-error").hide();
          $("#email-error-edit").hide();
        } else {
          $("#email-error").show();
          $("#email-error-edit").show();
        }
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  };

  $scope.deleteAdmin = function (id) {
    Swal.fire({
      title: "Are you sure?",
      text: "you want to delete this Data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        showHideLoad();
        var method = "DELETE";
        var url = "user/deleteUser";
        $http({
          method: method,
          params: { id: id },
          url: url,
          headers: {
            "Content-Type": "application/json",
          },
          transformResponse: angular.identity,
        }).then(_success, _error);
      }
    });
  };

  $scope.uploadFile = function (file) {
    var form_data = new FormData();
    form_data.append("module", "user");
    form_data.append("file", file);

    var config = {
      transformResponse: angular.identity,
      headers: {
        "Content-Type": undefined,
      },
    };
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
            confirmButton: "btn btn-primary",
          },
        });
      },
      // Error
      function (response) {
        Swal.fire({
          text: "File Upload failed! Please Upload Again",
          icon: "error",
          buttonsStyling: !1,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
        console.log(response);
      }
    );
  };

  $scope.changeView = function (view) {
    if (view == "add" || view == "list" || view == "show") {
      $("#user-name-error").hide();
      $scope.form = {};
    }
    if (view == "edit") {
      $("#user-name-error-edit").hide();
    }
    $scope.views.add = false;
    $scope.views.edit = false;
    $scope.views.list = false;
    $scope.views[view] = true;
  };
});
