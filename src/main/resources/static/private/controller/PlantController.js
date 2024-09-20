angular.module("Application").controller("PlantController", function ($scope, $http, $timeout, DTOptionsBuilder,$q) {
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
						title: "Plant",
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

	autoPlantListFetch();
	function autoPlantListFetch() {

		showHideLoad();
		$http({
			method: 'GET',
			url: 'api/v1/plant/getAllPlant'

		}).then(function successCallback(response) {
			console.log(response);
			$scope.plants = response.data;
			$scope.changeView('list');
			showHideLoad(true);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}

	$scope.fetchStates = function () {
		return $q(function (resolve, reject) {
			$scope.states = {};
			showHideLoad();
			$http({
				method: 'GET',
				url: 'api/v1/common/getState',
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
				method: 'GET',
				url: 'api/v1/common/getCountry',
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
	
	$scope.AddPlant = function () {
		showHideLoad();
		$q.all([$scope.fetchStates(), $scope.fetchCountry()]).then(function() {
			$scope.form = {}; // Initialize form to a new object
			$("#add_edit_plant_modal").modal("show");
			showHideLoad(true);
		});
	};
	
	$scope.editPlant = function (data) {
		showHideLoad();
		$q.all([$scope.fetchStates(), $scope.fetchCountry()]).then(function() {
			$scope.form = angular.copy(data); // Use angular.copy to avoid direct binding
			$("#add_edit_plant_modal").modal("show");
			showHideLoad(true);
		});
	};
	
	
	$scope.close = function () {
		$scope.form={};
		$("#add_edit_plant_modal").modal("hide");
	}

	$scope.savePlant = function () {
		showHideLoad();
		if ($scope.form.id == "" || $scope.form.id == undefined) {
			var method = "POST";
			var url = "api/v1/plant/createPlant";
		} else {
			var method = "PUT";
			var url = "api/v1/plant/updatePlant";
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
		autoPlantListFetch();
		$("#add_edit_plant_modal").modal("hide");
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

	$scope.changeTogglePlant = function (id) {
		// showHideLoad();
		$http({
			method: 'DELETE',
			params: { 'id': id },
			url: 'api/v1/plant/deletePlant',
			headers: {
				'Content-Type': 'application/json'
			},
			transformResponse: angular.identity

		}).then(function successCallback(response) {
			console.log(response.data);
			autoPlantListFetch();
			// showHideLoad(true);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}

	$scope.uploadFile = function (file) {
		var form_data = new FormData;
		form_data.append('module', 'logo');
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
	}
});