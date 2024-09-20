var app = angular.module("SuperAdminManagment", []);


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
			url: "dashboardAdmin/getDashboardForSuperAdmin",
		}).then(
			function successCallback(response) {
				console.log(response);
				$scope.data = response.data;

				$scope.data.StatusWish.forEach((item) => {
					$scope.BarChartData.labels.push(item.StatusLabel);
					$scope.BarChartData.datasets[0].data.push(item.Working);
					const randomColor = getRandomColor();
					$scope.BarChartData.datasets[0].backgroundColor.push(randomColor);
					$scope.BarChartData.datasets[0].hoverBackgroundColor.push(randomColor);
				});

				$scope.data.DeptWish.forEach((item) => {
					$scope.DoughnutChartData.labels.push(item.department);
					$scope.DoughnutChartData.datasets[0].data.push(item.TotalWorking);

					// Generate a random color for each department
					const randomColor = getRandomColor();
					$scope.DoughnutChartData.datasets[0].backgroundColor.push(randomColor);
					$scope.DoughnutChartData.datasets[0].hoverBackgroundColor.push(randomColor);
				});

				$scope.data.TypeWish.forEach((item) => {
					$scope.PieChartData.labels.push(item.type);
					$scope.PieChartData.datasets[0].data.push(item.Working);

					// Generate a random color for each department
					const randomColor = getRandomColor();
					$scope.PieChartData.datasets[0].backgroundColor.push(randomColor);
					$scope.PieChartData.datasets[0].hoverBackgroundColor.push(randomColor);
				});

				// Create the chart after processing the data
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
		  "#8E86ED", "#B4D5A9", "#63CDEE", "#CA78C6", "#8EDFE4",
		  "#EEAE4D", "#E98787", "#6A7DE2", "#EE6363", "#EE914D",
		  "#F3BD32", "#ED86AB", "#058CD8", "#DC8C13", "#3D8F29",
		  "#7C5A03", "#7C3603", "#D6691B", "#007DA5", "#219983",
		  "#B54179", "#762A2A", "#B46A8D", "#CE7A68", "#24477B",
		  "#219951", "#A885C5", "#B2AA59", "#AAC65A", "#3BBDE5"
		];
	  
		// Generate a random index to pick a color from the list
		const randomIndex = Math.floor(Math.random() * colors.length);
	  
		return colors[randomIndex];
	  }

	// Function to create the Chart.js chart
	function createChart() {
		const ctx = document.getElementById('myBarChart');
	
		new Chart(ctx, {
		  type: 'bar',
		  data: $scope.BarChartData,
		  options: {
			maintainAspectRatio: false,
			scales: {
			  y: {
				beginAtZero: true,
				///display: false, // Hide Y axis labels
				border: {
				  display: true // base line
				},
				grid: {
				  display: false
				},
				ticks: {
				  maxTicksLimit: 8,
				  display: true //this will show / remove only the label
				}
			  },
			  x: {
				border: {
				  display: true // base line
				},
				grid: {
				  display: false, //to hide vartical lines
				  drawTicks: false
				},
				ticks: {
				  display: true //this will show / remove only the label
				}
			  }
			},
			plugins: {
			  legend: {
				display: false //to hide top label
			  }
			}
		  }
		});
	
		const ctx1 = document.getElementById('myDoughnutChart');
	
		new Chart(ctx1, {
		  type: 'doughnut',
		  data: $scope.DoughnutChartData,
		  options: {
			maintainAspectRatio: false,
			scales: {
			  y: {
				beginAtZero: true,
				border: {
				  display: false // base line
				},
				grid: {
				  display: false, //to hide vartical lines
				  drawTicks: false
				},
				ticks: {
				  display: false //this will show / remove only the label
				}
			  }
			},
			plugins: {
			  legend: {
				position: 'bottom',
				labels: {
				  boxWidth: 12,
				  padding: 15
				}
			  }
			}
		  }
		});
		const ctx2 = document.getElementById('myPieChart');
	
		new Chart(ctx2, {
		  type: 'pie',
		  data: $scope.PieChartData,
		  options: {
			maintainAspectRatio: false,
			scales: {
			  y: {
				beginAtZero: true,
				border: {
				  display: false // base line
				},
				grid: {
				  display: false, //to hide vartical lines
				  drawTicks: false
				},
				ticks: {
				  display: false //this will show / remove only the label
				}
			  }
			},
			plugins: {
			  legend: {
				position: 'bottom',
				labels: {
				  boxWidth: 12,
				  boxHeight: 12,
				  padding: 15,
				  useBorderRadius: true,
				  borderRadius: 10
				}
			  }
			}
		  }
		});
	  }
});

app.controller("DashboardController1", function ($scope, $http, $timeout) {
	autoFetchDashboard();
	function autoFetchDashboard() {
	  showHideLoad();
	  $http({
		method: "GET",
		url: "dashboardAdmin/getCompanyAndSuperCompany",
	  }).then(
		function successCallback(response) {
		  console.log(response);
		  var iframeElement = document.getElementById("myIframe");
  
		  // Set the src attribute with the dynamic variables
		  iframeElement.src = "https://lookerstudio.google.com/embed/reporting/83732acf-0233-472f-b611-5dc13f6b130d/page/p_yz3cendrcd?params=%7B%22df27%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%2580"+response.data.SuperCompanyId+"%22%7D";
		  showHideLoad(true);
		},
		function errorCallback(response) {
		  console.log(response.statusText);
		}
	  );
	}
  });

app.controller("SubscriptionController", function ($scope, $http, $timeout) {

	autoSubscriptionListFetch();
	function autoSubscriptionListFetch() {
		showHideLoad();
		$http({
			method: 'GET',
			url: 'subscription-plans/getSubscriptionPlan'

		}).then(function successCallback(response) {
			console.log(response);
			$scope.subscriptions = response.data;
			showHideLoad(false);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}

	$scope.requestPlan = function (id) {
		$http({
			method: 'GET',
			params: { 'id': id },
			url: 'subscription-plans/requestSubscriptionPlanToggle',
			headers: {
				'Content-Type': 'application/json'
			},
			transformResponse: angular.identity

		}).then(function successCallback(response) {
			console.log(response.data);
			autoSubscriptionListFetch();
		}, function errorCallback(response) {
			Swal.fire(
				'Error!',
				response.data,
				'error'
			)
			autoSubscriptionListFetch();
			console.log(response.statusText);
		});
	}

});

app.controller("CompanyController", function ($scope, $http, $timeout) {

	$scope.form = {};
	$scope.views = {};
	$scope.countries = {};
	$scope.states = {};
	$scope.views.list = true;

	autoCompanyListFetch();
	function autoCompanyListFetch() {

		showHideLoad();
		$http({
			method: 'GET',
			url: 'companies/getAllCompanies'

		}).then(function successCallback(response) {
			console.log(response);
			$scope.companies = response.data;
			$scope.changeView('list');
			showHideLoad(true);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}

	$scope.fetchStates = function (id) {
		showHideLoad();
		$http({
			method: 'GET',
			url: 'common/getState'
		}).then(function successCallback(response) {
			$scope.states = response.data;
			// console.log($scope.states);
			showHideLoad(true);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}

	$scope.fetchCoutry = function (id) {
		showHideLoad();
		$http({
			method: 'GET',
			url: 'common/getCountry'
		}).then(function successCallback(response) {
			// console.log(response);
			$scope.countries = response.data;
			showHideLoad(true);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}

	$scope.AddCompany = function () {
		$scope.changeView('add');
		$scope.fetchStates();
		$scope.fetchCoutry();

	}
	$scope.changeStatus = function (id) {
		showHideLoad();
		$http({
			method: 'PUT',
			params: { 'id': id },
			url: 'user/accountStatusToggle',
			headers: {
				'Content-Type': 'application/json'
			},
			transformResponse: angular.identity

		}).then(function successCallback(response) {
			console.log(response.data);
			autoAdminListFetch();
			showHideLoad(true);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}
	$scope.changeExpiryStatus = function (id) {
		showHideLoad();
		$http({
			method: 'PUT',
			params: { 'id': id },
			url: 'user/accountExpiryToggle',
			headers: {
				'Content-Type': 'application/json'
			},
			transformResponse: angular.identity

		}).then(function successCallback(response) {
			console.log(response.data);
			autoAdminListFetch();
			showHideLoad(true);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}

	$scope.addSaveCompany = function () {
		showHideLoad();
		var method = "POST";
		var url = 'companies/createCompany';
		console.log($scope.form);
		$http({
			method: method,
			url: url,
			data: angular.toJson($scope.form),
			headers: {
				'Content-Type': 'application/json'
			},
			transformResponse: angular.identity
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
				confirmButton: "btn btn-primary"
			}
		})
	}

	function _error(response) {
		showHideLoad(true);
		Swal.fire({
			text: response.data,
			icon: "error",
			buttonsStyling: !1,
			confirmButtonText: "Ok, got it!",
			customClass: {
				confirmButton: "btn btn-primary"
			}
		})
	}
	$scope.editCompany = function (id) {
		showHideLoad();
		$http({
			method: 'GET',
			params: { 'id': id },
			url: 'companies/getCompanyById'

		}).then(function successCallback(response) {
			console.log(response.data);
			$scope.form = response.data;
			$scope.fetchStates();
			$scope.fetchCoutry();
			$scope.changeView('edit');
			showHideLoad(true);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}
	$scope.editSaveCompany = function () {
		console.log($scope.form);
		showHideLoad();

		var method = "PUT";
		var url = 'companies/updateCompany';
		$http({
			method: method,
			url: url,
			data: angular.toJson($scope.form),
			headers: {
				'Content-Type': 'application/json'
			},
			transformResponse: angular.identity
		}).then(_success, _error);
	};

	$scope.changeToggleSuperCompany = function (id) {
		showHideLoad();
		$http({
			method: 'DELETE',
			params: { 'id': id },
			url: 'companies/deleteCompany',
			headers: {
				'Content-Type': 'application/json'
			},
			transformResponse: angular.identity

		}).then(function successCallback(response) {
			console.log(response.data);
			autoCompanyListFetch();
			showHideLoad(true);
		}, function errorCallback(response) {
			console.log(response.statusText);
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
	}


});

app.controller("AdminController", function ($scope, $http, $timeout) {

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
			method: 'GET',
			url: 'user/getAdmin'

		}).then(function successCallback(response) {
			console.log(response);
			$scope.admins = response.data;
			$scope.changeView('list');
			showHideLoad(true);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}

	$scope.AddAdmin = function () {
		$scope.form={};
		$scope.fetchCompanies();
		$("#add_edit_user_modal").modal("show");
		$("#user-name-error").hide();
		$("#user-name-error-edit").hide();
	}
	$scope.changeStatus = function (id) {
		showHideLoad();
		$http({
			method: 'PUT',
			params: { 'id': id },
			url: 'user/accountStatusToggle',
			headers: {
				'Content-Type': 'application/json'
			},
			transformResponse: angular.identity

		}).then(function successCallback(response) {
			console.log(response.data);
			autoAdminListFetch();
			showHideLoad(true);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}
	$scope.changeExpiryStatus = function (id) {
		showHideLoad();
		$http({
			method: 'PUT',
			params: { 'id': id },
			url: 'user/accountExpiryToggle',
			headers: {
				'Content-Type': 'application/json'
			},
			transformResponse: angular.identity

		}).then(function successCallback(response) {
			console.log(response.data);
			autoAdminListFetch();
			showHideLoad(true);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}

	$scope.addEditUser = function () {
		//console.log($scope.form);
		showHideLoad();
		if ($scope.form.id == "" || $scope.form.id == undefined) {
		  var method = "POST";
		  var url = "user/creatAdmin";
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
				confirmButton: "btn btn-primary"
			}
		})
	}

	function _error(response) {
		showHideLoad(true);
		Swal.fire({
			text: response.data,
			icon: "error",
			buttonsStyling: !1,
			confirmButtonText: "Ok, got it!",
			customClass: {
				confirmButton: "btn btn-primary"
			}
		})
	}
	$scope.editAdmin = function (id) {
		$scope.fetchCompanies();
		$scope.form = {};
		showHideLoad();
		$http({
			method: 'GET',
			params: { 'id': id },
			url: 'user/userGetById'

		}).then(function successCallback(response) {
			$scope.form = response.data;
			$("#add_edit_user_modal").modal("show");
			$("#user-name-error").hide();
			$("#user-name-error-edit").hide();
			showHideLoad(true);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}


	$scope.fetchCompanies = function () {
		showHideLoad();
		$http({
			method: 'GET',
			url: 'companies/getAllCompanies'

		}).then(function successCallback(response) {
			$scope.companies = response.data;
			showHideLoad(true);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}

	$scope.checkUserNameAvailability = function (username) {
		showHideLoad();
		$http({
			method: 'GET',
			params: { 'username': username },
			url: 'user/usernameAvailability'

		}).then(function successCallback(response) {
			console.log(response.data);
			if (response.data == false) {
				$('#user-name-error').hide();
				$('#user-name-error-edit').hide();
			} else {
				$('#user-name-error').show();
				$('#user-name-error-edit').show();
			}
			showHideLoad(true);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}
	$scope.checkEmailAvailability = function (email) {
		showHideLoad();
		$http({
			method: 'GET',
			params: { 'email': email },
			url: 'user/emailAvailability'

		}).then(function successCallback(response) {
			console.log(response.data);
			if (response.data == false) {
				$('#email-error').hide();
				$('#email-error-edit').hide();
			} else {
				$('#email-error').show();
				$('#email-error-edit').show();
			}
			showHideLoad(true);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}

	$scope.deleteAdmin = function (id) {
		Swal.fire({
			title: 'Are you sure?',
			text: "you want to delete this Data!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
				showHideLoad();
				var method = "DELETE";
				var url = 'user/deleteUser';
				$http({
					method: method,
					params: { 'id': id },
					url: url,
					headers: {
						'Content-Type': 'application/json'
					},
					transformResponse: angular.identity
				}).then(_success, _error);
			}
		})
	}

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
			$('#user-name-error').hide();
		}
		if (view == "edit") {
			$('#user-name-error-edit').hide();
		}
		$scope.views.add = false;
		$scope.views.edit = false;
		$scope.views.list = false;
		$scope.views[view] = true;
	}


});


app.controller("ApplicationSetup", function ($scope, $http, $timeout) {
	$scope.form = {};
	$scope.views = {};
	$scope.views.list = true;
  
	autoApplicationSetupFetch();
	function autoApplicationSetupFetch() {
	  showHideLoad();
	  $http({
		method: "GET",
		url: "settings/getAllSettings",
	  }).then(
		function successCallback(response) {
		  console.log(response);
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
		var url = "settings/createSettings";
	  } else {
		var method = "PUT";
		var url = "settings/updateSettings";
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
		url: "settings/getSettingsById",
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
		url: "settings/deleteSettings",
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
  