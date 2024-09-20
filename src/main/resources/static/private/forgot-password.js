var app = angular.module("ForgotPasswordManagement", []);

app.controller("ForgotPasswordController", function ($scope, $http, $timeout) {

	$scope.username = '';
	$scope.email = '';
	$scope.otp = '';
	$scope.password = '';
	$scope.confirmPassword = '';
	$scope.otpSent = false;
	$scope.form = {};

	$scope.togglePasswordVisibility = function () {
		$scope.showPassword = !$scope.showPassword;
	};


	$scope.sendOTP = function () {
		$http({
			method: 'GET',
			params: { 'username': $scope.form.username, 'email': $scope.form.email },
			url: 'test/pushOTP',
			headers: {
				'Content-Type': 'application/json'
			},
			transformResponse: angular.identity

		}).then(function successCallback(response) {
			Swal.fire({
				text: response.data,
				icon: "success",
				buttonsStyling: !1,
				confirmButtonText: "Ok, got it!",
				customClass: {
					confirmButton: "btn btn-primary"
				}
			})
			$scope.otpSent = true;
		}, function errorCallback(response) {
			alert(response.data);
			console.log(response.statusText);
		});


	};

	$scope.submitForm = function () {

		if ($scope.form.otp.length != 6) {
			Swal.fire({
				text: "OTP should be 6 digits",
				icon: "error",
				buttonsStyling: !1,
				confirmButtonText: "Ok, got it!",
				customClass: {
					confirmButton: "btn btn-primary"
				}
			})
			return;
		}

		// Check if password and confirm password match
		if ($scope.form.password !== $scope.form.confirmPassword) {
			alert('Password and Confirm Password should match');
			return;
		}
		// $scope.otpSent = false; 
		$http({
			method: 'GET',
			params: { 'username': $scope.form.username, 'email': $scope.form.email, 'otp': $scope.form.otp, 'password': $scope.form.password },
			url: 'test/resetPassword',
			headers: {
				'Content-Type': 'application/json'
			},
			transformResponse: angular.identity

		}).then(function successCallback(response) {
			Swal.fire({
				text: response.data,
				icon: "Password changed successfully!",
				buttonsStyling: !1,
				confirmButtonText: "Ok, got it!",
				customClass: {
					confirmButton: "btn btn-primary"
				}
			}).then((result) => {
				if (result.isConfirmed) {
					window.location.href = "login";
				}
			});

		}, function errorCallback(response) {
			Swal.fire({
				text: response.data,
				icon: "error",
				buttonsStyling: !1,
				confirmButtonText: "Ok, got it!",
				customClass: {
					confirmButton: "btn btn-primary"
				}
			})
			console.log(response.statusText);
		});
	};

});