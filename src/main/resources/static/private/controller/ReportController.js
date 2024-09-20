angular.module("Application")
    .controller("ReportController", function ($scope, $http, $timeout, DTOptionsBuilder, $q) {
        $scope.form = {};
        $scope.views = {};
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
                    ],
                },
                // {
                //   extend: "colvis",
                //   text: '<span class="lbl-dropdown">Columns</span><span class="icon-common icon-btn-dropdown icon-chevron"></span>',
                // },

            ]);

        $scope.YearCodeData = function () {
            showHideLoad();
            $http({
                method: "GET",
                url: "api/v1/contract/getYearCode",
            }).then(
                function successCallback(response) {
                    console.log(response);
                    $scope.yearCode = response.data;
                    showHideLoad(true);
                },
                function errorCallback(response) {
                    //console.log(response.statusText);
                }
            );
        };
        $scope.ContractData = function (data) {
            showHideLoad();
            $http({
                method: "GET",
                params: { yearCode: data },
                url: "api/v1/contract/getYearCodeData",
            }).then(
                function successCallback(response) {
                    console.log(response);
                    $scope.contractData = response.data;
                    showHideLoad(true);
                },
                function errorCallback(response) {
                    //console.log(response.statusText);
                }
            );
        };
        $scope.TokenDetails = function () {
            showHideLoad();
            $http({
                method: "GET",
                url: "api/v1/token/getAllToken",
            }).then(
                function successCallback(response) {
                    $scope.tokens = response.data;
                    showHideLoad(true);
                },
                function errorCallback(response) {
                    //console.log(response.statusText);
                }
            );
        };
        $scope.BillDetails = function () {
            // showHideLoad();
            // $http({
            //     method: "GET",
            //     url: "report/getAssetDetails",
            // }).then(
            //     function successCallback(response) {
            //         console.log(response);
            //         $scope.billDetails = response.data;
            //         showHideLoad(true);
            //     },
            //     function errorCallback(response) {
            //         //console.log(response.statusText);
            //     }
            // );
        };
        $scope.BillPayment = function () {
            // showHideLoad();
            // $http({
            //     method: "GET",
            //     url: "report/getAssetDetails",
            // }).then(
            //     function successCallback(response) {
            //         console.log(response);
            //         $scope.billPayment = response.data;
            //         showHideLoad(true);
            //     },
            //     function errorCallback(response) {
            //         //console.log(response.statusText);
            //     }
            // );
        };
        $scope.HoldBillPayment = function () {
            // showHideLoad();
            // $http({
            //     method: "GET",
            //     url: "report/getAssetDetails",
            // }).then(
            //     function successCallback(response) {
            //         console.log(response);
            //         $scope.holdBillPayment = response.data;
            //         showHideLoad(true);
            //     },
            //     function errorCallback(response) {
            //         //console.log(response.statusText);
            //     }
            // );
        };

    }
    );