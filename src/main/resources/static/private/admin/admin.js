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

app.controller("DashboardController", function ($scope, $http, $timeout) {
  // Process the JSON data into a format suitable for Chart.js

  $scope.getAssetTypeDashboard = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "dashboardAdmin/getCompanyAndSuperCompany",
    }).then(
      function successCallback(response) {
        console.log(response);
        var iframeElement1 = document.getElementById("myIframe1");

        // Set the src attribute with the dynamic variables
        iframeElement1.src = "https://lookerstudio.google.com/embed/reporting/b496244f-c4fb-414d-8751-6e3e97471609/page/p_12lb2hh6ed?params=%7B%22df11%22:%22include%25EE%2580%2580" + response.data.SuperCompanyId + "%25EE%2580%2580IN%25EE%2580%2580" + response.data.CompanyId + "%22%7D";
        console.log(iframeElement1.src);
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  }


  $scope.getGoogleDashboard = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "dashboardAdmin/getCompanyAndSuperCompany",
    }).then(
      function successCallback(response) {
        console.log(response);
        var iframeElement = document.getElementById("myIframe");

        // Set the src attribute with the dynamic variables
        iframeElement.src = "https://lookerstudio.google.com/embed/reporting/83732acf-0233-472f-b611-5dc13f6b130d/page/p_yz3cendrcd?params=%7B%22df27%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%2580" + response.data.SuperCompanyId + "%22,%22df23%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%2580" + response.data.CompanyId + "%22%7D";
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  }
  $scope.getAssetDataDashboard = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "dashboardAdmin/getCompanyAndSuperCompany",
    }).then(
      function successCallback(response) {
        console.log(response);
        var iframeElement = document.getElementById("myIframe2");

        // Set the src attribute with the dynamic variables
        iframeElement.src = "https://lookerstudio.google.com/embed/reporting/b496244f-c4fb-414d-8751-6e3e97471609/page/p_ev9vh6mjhd?params=%7B%22df10%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%2580" + response.data.SuperCompanyId + "%22,%22df11%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%2580" + response.data.CompanyId + "%22,%22df8%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%2580" + response.data.SuperCompanyId + "%22,%22df9%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%2580" + response.data.CompanyId + "%22%7D";
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  }


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
        borderWidth: 1,
        maxBarThickness: 25,
      },
    ],
  };

  $scope.PieChartData = {
    labels: [], // department names
    datasets: [
      {
        data: [], // TotalWorking data
        backgroundColor: [], // Random colors for each department.
        hoverBackgroundColor: [],
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
      url: "dashboardAdmin/getDashboardForAdmin",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.data = response.data;

        $scope.data.StatusWish.forEach((item) => {
          $scope.BarChartData.labels.push(item.StatusLabel);
          $scope.BarChartData.datasets[0].data.push(item.Working);
          const randomColor = getRandomColor();
          $scope.BarChartData.datasets[0].backgroundColor.push(randomColor);
          $scope.BarChartData.datasets[0].hoverBackgroundColor.push(
            randomColor
          );
        });

        $scope.data.DeptWish.forEach((item) => {
          $scope.DoughnutChartData.labels.push(item.department);
          $scope.DoughnutChartData.datasets[0].data.push(item.TotalWorking);

          // Generate a random color for each department
          const randomColor = getRandomColor();
          $scope.DoughnutChartData.datasets[0].backgroundColor.push(
            randomColor
          );
          $scope.DoughnutChartData.datasets[0].hoverBackgroundColor.push(
            randomColor
          );
        });

        $scope.data.TypeWish.forEach((item) => {
          $scope.PieChartData.labels.push(item.type);
          $scope.PieChartData.datasets[0].data.push(item.Working);

          // Generate a random color for each department
          const randomColor = getRandomColor();
          $scope.PieChartData.datasets[0].backgroundColor.push(randomColor);
          $scope.PieChartData.datasets[0].hoverBackgroundColor.push(
            randomColor
          );
        });

        // Create the chart after processing the data
        createChart();

        showHideLoad(true);
      },
      function errorCallback(response) {
        // Handle error
        //console.log(response.statusText);
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
    const ctx = document.getElementById("myBarChart");

    new Chart(ctx, {
      type: "bar",
      data: $scope.BarChartData,
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ///display: false, // Hide Y axis labels
            border: {
              display: true, // base line
            },
            grid: {
              display: false,
            },
            ticks: {
              maxTicksLimit: 8,
              display: true, //this will show / remove only the label
            },
          },
          x: {
            border: {
              display: true, // base line
            },
            grid: {
              display: false, //to hide vartical lines
              drawTicks: false,
            },
            ticks: {
              display: true, //this will show / remove only the label
            },
          },
        },
        plugins: {
          legend: {
            display: false, //to hide top label
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
    const ctx2 = document.getElementById("myPieChart");

    new Chart(ctx2, {
      type: "pie",
      data: $scope.PieChartData,
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
              boxHeight: 12,
              padding: 15,
              useBorderRadius: true,
              borderRadius: 10,
            },
          },
        },
      },
    });
  }
});

app.controller("DashboardControllerService", function ($scope, $http, $timeout) {
  showHideLoad(true);

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


  autoUserListFetch();
  function autoUserListFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "dashboardAdmin/getDashboardForServiceEngineer",
    }).then(
      function successCallback(response) {
        console.log(response);
        $scope.data = response.data;

        $scope.BarChartData.labels.push("Assign Call");
        $scope.BarChartData.datasets[0].data.push($scope.data.assignCall);
        $scope.BarChartData.datasets[0].backgroundColor.push(getRandomColor());
        $scope.BarChartData.datasets[0].hoverBackgroundColor.push(
          getRandomColor()
        );

        $scope.BarChartData.labels.push("Resolved Call");
        $scope.BarChartData.datasets[0].data.push($scope.data.resolveCall);
        $scope.BarChartData.datasets[0].backgroundColor.push(getRandomColor());
        $scope.BarChartData.datasets[0].hoverBackgroundColor.push(
          getRandomColor()
        );

        $scope.BarChartData.labels.push("Pending Call");
        $scope.BarChartData.datasets[0].data.push($scope.data.pendingCall);
        $scope.BarChartData.datasets[0].backgroundColor.push(getRandomColor());
        $scope.BarChartData.datasets[0].hoverBackgroundColor.push(
          getRandomColor()
        );

        $scope.BarChartData.labels.push("Dismiss Call");
        $scope.BarChartData.datasets[0].data.push($scope.data.dismissCall);
        $scope.BarChartData.datasets[0].backgroundColor.push(getRandomColor());
        $scope.BarChartData.datasets[0].hoverBackgroundColor.push(
          getRandomColor()
        );
        createChart();
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  }



  function createChart() {
    const ctx = document.getElementById("myBarChart");

    new Chart(ctx, {
      type: "bar",
      data: $scope.BarChartData,
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ///display: false, // Hide Y axis labels
            border: {
              display: true, // base line
            },
            grid: {
              display: false,
            },
            ticks: {
              maxTicksLimit: 8,
              display: true, //this will show / remove only the label
            },
          },
          x: {
            border: {
              display: true, // base line
            },
            grid: {
              display: false, //to hide vartical lines
              drawTicks: false,
            },
            ticks: {
              display: true, //this will show / remove only the label
            },
          },
        },
        plugins: {
          legend: {
            display: false, //to hide top label
          },
        },
      },
    });
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


});

app.controller("UserController", function ($scope, $http, $timeout, DTOptionsBuilder) {
  $scope.form = {};
  $scope.views = {};
  $scope.views.list = true;
  $scope.showPassword = false;

  $scope.togglePassword = function () {
    $scope.showPassword = !$scope.showPassword;
  };
  $scope.dtOptions = DTOptionsBuilder.newOptions().withOption("stateSave", true).withOption("lengthMenu", [
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
            title: "User",
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
            extend: "pdf",
            text: '<span class="icon-common icon-dropdown-action icon-pdf"></span><span class="lbl-dropdown-action">PDF</span>', // Icon for PDF
            className: "btn btn-danger",
            title: "User",
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

  autoUserListFetch();
  function autoUserListFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "user/getUser",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.users = response.data;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  }

  $scope.addEditUser = function () {
    //console.log($scope.form);
    showHideLoad();
    if ($scope.form.id == "" || $scope.form.id == undefined) {
      var method = "POST";
      var url = "user/creatUser";
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


  $scope.AddUser = function () {
    $scope.form = {};
    $("#add_edit_user_modal").modal("show");
    $("#user-name-error").hide();
    $("#user-name-error-edit").hide();
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
  $scope.editUser = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "user/userGetById",
    }).then(
      function successCallback(response) {
        console.log(response.data);
        $scope.form = response.data;
        $("#add_edit_user_modal").modal("show");
        $("#user-name-error").hide();
        $("#user-name-error-edit").hide();
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
      method: "PUT",
      params: { id: id },
      url: "user/accountStatusToggle",
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
    showHideLoad();
    $http({
      method: "GET",
      params: { username: username },
      url: "user/usernameAvailability",
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
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
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
        //console.log(response.data);
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

app.controller("AssetController", function ($scope, $http, $timeout, DTOptionsBuilder, $q) {
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
    .withOption('initComplete', function () {
      // Add individual column searching (multiple select inputs using select2)
      this.api().columns().every(function () {
        var column = this;
        var select = $('<select class="form-control" multiple="multiple"><option value=""></option></select>')
          .appendTo($(column.footer()).empty())
          .on('change', function () {
            var selectedValues = $(this).val();
            var joinedValues = selectedValues ? selectedValues.join('|') : '';
            column
              .search(joinedValues, true, false)
              .draw();
          });

        column.data().unique().sort().each(function (d, j) {
          select.append('<option value="' + d + '">' + d + '</option>');
        });

        // Apply the Select2 plugin
        select.select2({
          placeholder: "Select values",
          width: "100%",
        });
      });
    })
    .withButtons([
      {
        extend: "collection",
        text: '<span class="lbl-dropdown">Export</span><span class="icon-common icon-btn-dropdown icon-chevron"></span>',
        buttons: [
          {
            extend: "copy",
            text: '<span class="icon-common icon-dropdown-action icon-copy"></span><span class="lbl-dropdown-action">Copy</span>', // Icon for Copy
            className: "btn btn-default",
            title: "Master Asset",
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
            title: "Master Asset",
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
            title: "Master Asset",
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
      url: "asset/getAllAsset",
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

  $scope.isIPAddress = function (input) {
    var ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipRegex.test(input);
  }

  $scope.isURL = function (input) {
    var urlRegex = /^(https?:\/\/)?([\w.-]+\.)?[\w-]+\.\w{2,}(:\d+)?(\/[\w.-]*)*$/;
    return urlRegex.test(input);
  }

  $scope.getAbsoluteUrl = function (ipAddress) {
    // Check if the ipAddress already contains "http" or "https"
    if (ipAddress.includes("http://") || ipAddress.includes("https://")) {
      return ipAddress;
    } else {
      // Construct the absolute URL without the base URL
      return 'http://' + ipAddress;
    }
  };



  $scope.changeStatus = function (id) {
    showHideLoad();
    $http({
      method: "DELETE",
      params: { id: id },
      url: "asset/toggleAssetActive",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        //console.log(response.data);
        // autoAssetListFetch();
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.dismissAsset = function (id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "you want to delete this Asset!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        $http({
          method: "DELETE",
          params: { id: id },
          url: "asset/dismissAsset",
          headers: {
            "Content-Type": "application/json",
          },
          transformResponse: angular.identity,
        }).then(_success, _error);
      }
    })
  }


  function _success(response) {
    showHideLoad(true);
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
  };


  $scope.fetchAssetType = function () {
    var deferred = $q.defer();
    showHideLoad();
    $http({
      method: "GET",
      url: "assetType/getTotalAssetType",
    }).then(
      function successCallback(response) {
        $scope.assetTypes = response.data;
        showHideLoad(true);
        deferred.resolve($scope.assetTypes);
      },
      function errorCallback(response) {
        throw new Error("Failed to fetch data");
      }
    );
    return deferred.promise;
  };

  $scope.typeFinder = function (name) {
    //console.log(name);
    $scope.entity = {};
    $scope.entity = $scope.assetTypes.filter((item) => item.type === name);
    //console.log($scope.entity);
  };

  $scope.viewAsset = function (id) {
    showHideLoad();
    document.getElementById("qrcode").innerHTML = "";
    document.getElementById("barcode").innerHTML = "";
    $http({
      method: "GET",
      params: { id: id },
      url: "asset/getAssetById",
    }).then(
      function successCallback(response) {
        // console.log(response.data);
        $scope.asset = response.data;
        $scope.fetchAssetType().then(function (assetTypeData) {
          $scope.typeFinder($scope.asset.type);
        });
        $scope.changeView("show");
        showHideLoad(true);
        var tagIdInfo =
          "CompanyId: " +
          $scope.asset.companyId +
          "\n" +
          "SuperCompanyId: " +
          $scope.asset.superCompanyId +
          "\n" +
          "Tag ID: " +
          $scope.asset.assetTagId;
        var serialInfo =
          "SC:" +
          $scope.asset.superCompanyId +
          ",C:" +
          $scope.asset.companyId +
          ",SL:" +
          $scope.asset.serialNo;
        var qrcode = new QRCode(document.getElementById("qrcode"), {
          text: tagIdInfo,
          width: 128,
          height: 128,
        });
        JsBarcode("#barcode", serialInfo, {
          format: "CODE128",
          width: 1,
          height: 50,
          displayValue: false,
        });
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };





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
    }
    $scope.views.add = false;
    $scope.views.edit = false;
    $scope.views.list = false;
    $scope.views.show = false;
    $scope.views[view] = true;
  };
}
);

app.controller("ReportController", function ($scope, $http, $timeout, DTOptionsBuilder, $q) {
  $scope.form = {};
  $scope.views = {};
  $scope.views.list = true;
  $scope.assetTypeData = [];
  $scope.assetTypeDetailsData = [];
  $scope.assetCatData = [];
  $scope.assetCatDetailsData = [];
  $scope.assetLocationData = [];
  $scope.assetLocationDetailsData = [];
  $scope.yearCode = [];
  $scope.depreciationData = [];
  $scope.yearCd = "";
  showHideLoad(true);
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
            title: "Report",
            exportOptions: {
              modifier: {
                page: "current",
              },
            },
          },
          {
            extend: "excel",
            text: '<span class="icon-common icon-dropdown-action icon-excel"></span><span class="lbl-dropdown-action">Excel</span>', // Icon for Excel
            className: "btn btn-success",
            title: "Report",
            exportOptions: {
              modifier: {
                page: "current",
              },
              header: false, // Exclude the header row
            },
          },
          // {
          //   extend: "pdf",
          //   text: '<span class="icon-common icon-dropdown-action icon-pdf"></span><span class="lbl-dropdown-action">PDF</span>', // Icon for PDF
          //   className: "btn btn-danger",
          //   title: "Report",
          //   exportOptions: {
          //     modifier: {
          //       page: "current",
          //     },
          //   },
          // },
          // {
          //   extend: "print",
          //   text: '<span class="icon-common icon-dropdown-action icon-print"></span><span class="lbl-dropdown-action">Print</span>',
          //   autoPrint: true,
          //   exportOptions: {
          //     modifier: {
          //       page: "current",
          //     },
          //   },
          // },
        ],
      },
      {
        extend: "colvis",
        text: '<span class="lbl-dropdown">Columns</span><span class="icon-common icon-btn-dropdown icon-chevron"></span>',
      },

    ]);

  $scope.getDetailReport = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "report/getAssetDetails",
    }).then(
      function successCallback(response) {
        console.log(response);
        $scope.detailReport = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };
  $scope.getCallLogReport = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "CallLog/getAllCallLog",
    }).then(
      function successCallback(response) {
        console.log(response);
        $scope.logs = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };
  $scope.TypeWishData = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "report/getAssetReportTypeWish",
    }).then(
      function successCallback(response) {
        // //console.log(response);
        $scope.assetTypeData = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.SaleData = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "report/getAssetReportForSale",
    }).then(
      function successCallback(response) {
        // //console.log(response);
        $scope.assetSaleData = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.saleDetailData = function (type) {
    // alert("hi");
    $scope.assetSaleDataDetails = {};
    showHideLoad();
    $http({
      method: "GET",
      params: { type: type },
      url: "report/getAssetReportForSaleDetail",
    }).then(
      function successCallback(response) {
        // //console.log(response);
        $scope.assetSaleDataDetails = response.data;
        $("#asset_sale_detail").modal("show");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.fetchAssetType = function () {
    var deferred = $q.defer();
    showHideLoad();
    $http({
      method: "GET",
      url: "assetType/getTotalAssetType",
    }).then(
      function successCallback(response) {
        $scope.assetTypes = response.data;
        showHideLoad(true);
        deferred.resolve($scope.assetTypes);
      },
      function errorCallback(response) {
        throw new Error("Failed to fetch manufacturer data");
      }
    );
    return deferred.promise;
  };

  $scope.typeFinder = function (name) {
    //console.log(name);
    $scope.entity = {};
    $scope.entity = $scope.assetTypes.filter((item) => item.type === name);
    //console.log($scope.entity);
  };

  $scope.fetchEmployeies = function () {
    $scope.employeies={};
    showHideLoad();
    $http({
      method: "GET",
      url: "employee/getEmployees",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.employeies = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.EmployeeWishData = function (empCode) {
    // alert("hi");
    showHideLoad();
    $http({
      method: "GET",
      params: { empCode: empCode },
      url: "report/getAssetReportDetailsEmployeeWish",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.assetEmpData = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };


  $scope.CategoryWishData = function () {
    // alert("hi");
    showHideLoad();
    $http({
      method: "GET",
      url: "report/getAssetReportCategoryWish",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.assetCatData = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };
  $scope.LocationWishData = function () {
    // alert("hi");
    showHideLoad();
    $http({
      method: "GET",
      url: "report/getAssetReportLocationWish",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.assetLocationData = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.TypeWishDetailsData = function (type) {

    $scope.fetchAssetType().then(function (data) {
      $scope.typeFinder(type);
      // alert("hi");
      showHideLoad();
      $http({
        method: "GET",
        url: "report/getAssetReportDetailsTypeWish",
        params: { type: type },
      }).then(
        function successCallback(response) {
          //console.log(response);
          $scope.assetTypeDetailsData = response.data;
          $("#asset_report_type").modal("show");
          showHideLoad(true);
        },
        function errorCallback(response) {
          //console.log(response.statusText);
        }
      );
    });
  };

  $scope.LocationwishDetailsData = function (location) {
    // alert("hi");
    showHideLoad();
    $http({
      method: "GET",
      url: "report/getAssetReportDetailsLocationWish",
      params: { location: location },
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.assetLocationDetailsData = response.data;
        $("#asset_report_loc").modal("show");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.CategoryWishDetailsData = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      url: "report/getAssetReportDetailsCategoryWish",
      params: { catId: id },
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.assetCatDetailsData = response.data;
        $("#asset_report_cat").modal("show");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.yearCodeControl = function () {
    $scope.depreciationData = [];
    $scope.yearCode={};
    showHideLoad();
    $http({
      method: "GET",
      url: "report/yearCodeControl",
      params: { catId: id },
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.yearCode = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };
  $scope.fetchProject = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "report/getAssetForProject",
    }).then(
      function successCallback(response) {
        console.log(response);
        $scope.projects = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };
  $scope.reportOnDepreciation = function (yearCode) {
    showHideLoad();
    $http({
      method: "GET",
      url: "report/reportOnDepreciation",
      params: { yearCode: yearCode },
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.depreciationData = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.Warranty = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "report/getAssetsWithRemainingWarranty",
    }).then(
      function successCallback(response) {
        // //console.log(response);
        $scope.warrants = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.Amc = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "report/getAssetsWithRemainingAmc",
    }).then(
      function successCallback(response) {
        // //console.log(response);
        $scope.amcs = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };

  $scope.Insurance = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "report/getAssetsWithRemainingInsurance",
    }).then(
      function successCallback(response) {
        // //console.log(response);
        $scope.insurances = response.data;
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  };



}
);

app.controller("ApplicationSetup", function ($scope, $http, $timeout) {
  $scope.form = {};
  $scope.views = {};
  $scope.views.list = true;

  autoApplicationSetupFetch();
  function autoApplicationSetupFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "applicationSetups/getAllApplicationSetups",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.applications = response.data;
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  }

  $scope.AddLocation = function () {
    $scope.form = {};
    $("#add_edit_location_modal").modal("show");
  };

  $scope.addEditSaveApplicationSetup = function () {
    //console.log($scope.form);
    showHideLoad();
    if ($scope.form.id == "" || $scope.form.id == undefined) {
      var method = "POST";
      var url = "applicationSetups/createApplicationSetup";
    } else {
      var method = "PUT";
      var url = "applicationSetups/updateApplicationSetup";
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
    autoApplicationSetupFetch();
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
  $scope.editApplicationSetup = function (id) {
    showHideLoad();
    $http({
      method: "GET",
      params: { id: id },
      url: "applicationSetups/getApplicationSetupById",
    }).then(
      function successCallback(response) {
        //console.log(response.data);
        $scope.form = response.data;
        $scope.form.delete = JSON.stringify(response.data.delete);
        $scope.form.edit = JSON.stringify(response.data.edit);
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
      url: "applicationSetups/deleteApplicationSetup",
      headers: {
        "Content-Type": "application/json",
      },
      transformResponse: angular.identity,
    }).then(
      function successCallback(response) {
        //console.log(response.data);
        autoApplicationSetupFetch();
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
});

app.controller("AssetLogisticsController", function ($scope, $http, $timeout, DTOptionsBuilder, $q) {
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

  autoAssetListFetch();
  function autoAssetListFetch() {
    showHideLoad();
    $http({
      method: "GET",
      url: "asset/getAssetsForLogistics",
    }).then(
      function successCallback(response) {
        //console.log(response);
        $scope.assets = response.data;
        $scope.assets.forEach(function (asset) {
          asset.select = false;
        });
        $scope.assets.select = false;
        console.log($scope.assets);
        $scope.changeView("list");
        showHideLoad(true);
      },
      function errorCallback(response) {
        console.log(response.statusText);
      }
    );
  }

  $scope.selectAction = function () {
    // Toggle the global select property for all assets
    $scope.assets.select = !$scope.assets.select;

    // Toggle the select property for each individual asset
    $scope.assets.forEach(function (asset) {
      asset.select = $scope.assets.select;
    });
  };

  $scope.assetReceive = function (id) {
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
          params: { 'id': id, 'date': result.value },
          url: 'asset/getAssetsLogisticsUpdate',
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


  $scope.allAssetReceive = function () {
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
          url: 'asset/getAllAssetsLogisticsUpdate',
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

  $scope.assetDismiss = function (id) {
    showHideLoad();
    $http({
      method: 'PUT',
      params: { 'id': id },
      url: 'asset/getAssetsLogisticsDismiss',
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

  $scope.allAssetDismiss = function () {
    var ids = [];
    $scope.assets.forEach(function (asset) {
      if (asset.select == true) {
        ids.push(asset.id);
      }
    });
    showHideLoad();
    $http({
      method: 'PUT',
      params: { 'id': ids },
      url: 'asset/getAllAssetsLogisticsDismiss',
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

app.controller("PrintController", function ($scope, $http, $timeout) {
  $scope.views = {};
  $scope.views.list = true;
  showHideLoad(true);

  $scope.fetchAssetList = function () {
    showHideLoad();
    $http({
      method: "GET",
      url: "asset/getAllAsset",
    }).then(
      function successCallback(response) {
        // //console.log(response);
        $scope.assets = response.data;
        $timeout(function () {
          $('.selectpicker').selectpicker('refresh');
        });
        showHideLoad(true);
      },
      function errorCallback(response) {
        //console.log(response.statusText);
      }
    );
  }

  $scope.fetchQRData = function () {
    showHideLoad();
    var params = {
      type: $scope.form.type,
    };
    if ($scope.form.type === 'id') {
      params.ids = $scope.form.tags;
    } else {
      params.ids = $scope.form.serials;
    }
    $http({
      method: 'GET',
      params: params,
      url: 'asset/getAssetTagIdForQRCODE',
    })
      .then(function (response) {
        showHideLoad(false);
        $("#asset_print").modal("hide");
        if ($scope.form.type === 'id') {
          $scope.qrCodes = response.data;
          // Generate QR codes after data is fetched
          $timeout(function () {
            angular.forEach($scope.qrCodes, function (code, index) {
              var qrcode = new QRCode(document.getElementById('qrcode' + index), {
                text: code.printValue,
                width: 128,
                height: 128,
              });
            });
          });
        }
        else {
          $scope.barCodes = response.data;
          // Generate Barcodes after data is fetched
          $timeout(function () {
            angular.forEach($scope.barCodes, function (serialInfo, index) {
              var barcodeElement = document.getElementById('barcode' + index);
              JsBarcode(barcodeElement, serialInfo.printValue, {
                format: "CODE128",
                width: 1,
                height: 50,
                displayValue: false,
              });
            });
          });
        }
      })
      .catch(function (error) {
        console.error('Error fetching QR data', error);
      });
  };

  $scope.search = function () {
    $scope.fetchAssetList();
    $scope.qrCodes = [];
    $scope.barCodes = [];
    $scope.form = {};
    $('.selectpicker').selectpicker('refresh');
    $("#asset_print").modal("show");
  }
  $scope.reset = function () {
    $('.selectpicker').selectpicker('refresh');
  }

  $scope.printPage = function () {
    var printContents = document.getElementById('print').innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
  };
}
);



