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

app.controller("AssetTypeController", function ($scope, $http, $timeout, DTOptionsBuilder) {
    $scope.form = {};
    $scope.rows = [{ caption: '', type: '', unit: '', minValue: '', maxValue: '', maxLength: '', required: '' }];
    $scope.subform = {};
    $scope.subDetailform = [{ assetTypeDetailId: '', caption: '' }];
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
                        title: "AssetType",
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
                        title: "AssetType",
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
                        title: "AssetType",
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

    autoAssetTypeListFetch();
    function autoAssetTypeListFetch() {
        showHideLoad();
        $http({
            method: "GET",
            url: "assetType/getAllAssetType",
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

    $scope.AddAssetType = function () {
        $scope.form = {};
        $("#add_edit_assetType_modal").modal("show");
    };

    $scope.addEditSaveAssetType = function () {
        //console.log($scope.form);
        showHideLoad();
        if ($scope.form.id == "" || $scope.form.id == undefined) {
            var method = "POST";
            var url = "assetType/createAssetType";
        } else {
            var method = "PUT";
            var url = "assetType/updateAssetType";
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
        $("#add_edit_assetType_modal").modal("hide");
        $("#add_AssetType_detail_modal").modal("hide");
        $("#add_AssetType_detail_dropdown_modal").modal("hide");
        $("#edit_AssetType_detail_modal").modal("hide");
        autoAssetTypeListFetch();
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

    $scope.editSubAsset = function (id) {
        showHideLoad();
        $http({
            method: "GET",
            params: { id: id },
            url: "assetType/getAssetTypeById",
        }).then(
            function successCallback(response) {
                //console.log(response.data);
                $scope.form = response.data;
                $("#add_edit_assetType_modal").modal("show");
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
            url: "assetType/deleteAssetType",
            headers: {
                "Content-Type": "application/json",
            },
            transformResponse: angular.identity,
        }).then(
            function successCallback(response) {
                //console.log(response.data);
                autoAssetTypeListFetch();
                showHideLoad(true);
            },
            function errorCallback(response) {
                //console.log(response.statusText);
            }
        );
    };

    $scope.addAssetTypeDetail = function (id, length) {
        $scope.rows = [{ assetTypeId: id, caption: '', type: '', unit: '', minValue: '', maxValue: '', maxLength: '', required: false }];
        $scope.assetTypeId = id;
        $scope.assetLength = length;
        $("#add_AssetType_detail_modal").modal("show");
    };

    $scope.addRow = function () {
        if (($scope.rows.length + $scope.assetLength) < 16) {
            $scope.rows.push({ assetTypeId: $scope.assetTypeId, caption: '', type: '', unit: '', minValue: '', maxValue: '', maxLength: '', required: false });
        } else {
            Swal.fire({
                text: "Maximum row limit reached (16 rows).",
                icon: "error",
                buttonsStyling: !1,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn btn-primary",
                },
            });
        }
    };

    $scope.removeRow = function (index) {
        $scope.rows.splice(index, 1);
    };

    $scope.addSaveAssetTypeDetails = function () {
        //console.log($scope.rows);
        showHideLoad();

        var method = "POST";
        var url = "assetTypeDetail/createAssetTypeDetail";
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


    $scope.fetchAllDetails = function (id, details) {
        $scope.assetTypeId = id;
        $scope.assetTypeDetails = details;
        $("#show_AssetType_detail_modal").modal("show");
    };

    $scope.editAssetTypeDetails = function (id) {
        showHideLoad();
        $http({
            method: "GET",
            params: { id: id },
            url: "assetTypeDetail/getAssetTypeDetailById",
        }).then(
            function successCallback(response) {
                $("#show_AssetType_detail_modal").modal("hide");
                //console.log(response.data);
                $scope.subform = response.data;
                $("#edit_AssetType_detail_modal").modal("show");
                showHideLoad(true);
            },
            function errorCallback(response) {
                //console.log(response.statusText);
            }
        );
    };

    $scope.SaveEditAssetTypeDetails = function () {
        //console.log($scope.subform)
        showHideLoad();
        var method = "PUT";
        var url = "assetTypeDetail/updateAssetTypeDetail";
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

    $scope.changeSubCatStatus = function (id) {
        showHideLoad();
        $http({
            method: "DELETE",
            params: { id: id },
            url: "assetTypeDetail/toggleAssetTypeDetailStatus",
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

    $scope.AddDropDown = function (id) {
        $scope.subDetailform = [{ assetTypeDetailId: id, caption: '' }];
        $scope.assetTypeDetailId = id;
        $("#add_AssetType_detail_dropdown_modal").modal("show");
        $("#show_AssetType_detail_modal").modal("hide");
    };

    $scope.addDetailRow = function () {
        $scope.subDetailform.push({ assetTypeDetailId: $scope.assetTypeDetailId, caption: '' });
    };

    $scope.removeDetailRow = function (index) {
        $scope.subDetailform.splice(index, 1);
    };

    $scope.addSaveAssetTypeDetailDropDown = function () {
        //console.log($scope.subDetailform);
        showHideLoad();
        var method = "POST";
        var url = "assetTypeDetailDes/createAssetTypeDetailDes";
        $http({
            method: method,
            url: url,
            data: angular.toJson($scope.subDetailform),
            headers: {
                "Content-Type": "application/json",
            },
            transformResponse: angular.identity,
        }).then(_success, _error);
    };

    $scope.fetchAllDropDownDetails = function (id, details) {
        $scope.dropDownDetails = details;
        $("#show_AssetType_dropdown_modal").modal("show");
    };


    $scope.UpdateDropDownDetails = function (data) {
        showHideLoad();
        $http({
            method: "PUT",
            url: "assetTypeDetailDes/updateAssetTypeDetailDes",
            data: angular.toJson(data),
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
            url: "asset/getAllAsset",
        }).then(
            function successCallback(response) {
                console.log(response);
                $scope.assets = response.data;
                $scope.assets.forEach(function (asset) {
                    asset.select = false;
                });
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
            if (asset.status == 'IN-TRANSIT') {
                asset.select = $scope.assets.select;
            }
        });
    };



    $scope.AddAsset = function () {
        $scope.entity = {};
        $scope.form = {};
        $scope.fetchAssetType();
        $scope.fetchManufacture();
        $scope.fetchSuppliers();
        $("#add_edit_Asset").modal("show");
    };


    $scope.outOfService = function () {
        // Variable to check if at least one asset is selected
        var atLeastOneSelected = false;

        $scope.assets.forEach(function (asset) {
            if (asset.select == true) {
                // Handle the case when asset.select is true
                atLeastOneSelected = true;
                // Add any additional logic for the first selected asset here
                // Exit the loop as soon as the first selected asset is found
                return;
            }
        });
        if (atLeastOneSelected) {
            // Reset form and locations
            $scope.form = {};
            $scope.locations = {};
            $scope.form.type = "Scrap"; // Use a single '=' for assignment
            $scope.fetchLocation();
            $("#Asset_Disposition").modal("show");
        } else {
            // Handle the case when no asset is selected, show an error or perform other actions
            Swal.fire("Error!", "No IN-TRANSIT asset selected.", "error");
            // You may want to show a user-friendly error message or take other actions
        }
    }


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


    $scope.assetDispositionSave = function () {
        console.log($scope.form);

        $scope.form.ids = [];

        $scope.assets.forEach(function (asset) {
            if (asset.select == true) {
                $scope.form.ids.push(asset.id);
            }
        });

        console.log($scope.form);
        showHideLoad();
        $http({
            method: "PUT",
            params: { 'id': $scope.form.ids, 'type': $scope.form.type, 'note': $scope.form.note, 'location': $scope.form.locationName, 'subLocation': $scope.form.subLocation, 'date': $scope.form.date },
            url: "asset/updateBlukAssetScrap",
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

    $scope.uploadModal = function () {
        $scope.form = {};
        $scope.form.activeUpload = false;
        $scope.fetchAssetType();
        $("#upload_modal").modal("show");
    };
    $scope.resetUpload = function () {
        $scope.form.activeUpload = false;
    };

    $scope.downloadExcel = function (type) {
        showHideLoad();
        $http({
            method: 'GET',
            params: { 'type': type },
            responseType: 'arraybuffer',
            url: 'excel/getAssetTemplate'
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
        // Directly return a resolved promise with the filtered entity
        $scope.entity = $scope.assetTypes.filter((item) => item.type === name);
        console.log($scope.entity);
        return $q.resolve();
    };


    $scope.fetchManufacture = function () {
        showHideLoad();
        $http({
            method: "GET",
            url: "manufacturer/getAllManufacturer",
        }).then(
            function successCallback(response) {
                //console.log(response.data);
                $scope.manufactures = response.data;
                showHideLoad(true);
            },
            function errorCallback(response) {
                //console.log(response.statusText);
            }
        );
    };

    $scope.fetchAssetTypeDropDown = function (type) {
        showHideLoad();
        $http({
            method: "GET",
            params: { type: type },
            url: "assetType/getAssetTypeDropDown",
        }).then(
            function successCallback(response) {
                //console.log(response.data);
                $scope.typeDropDown = response.data;
                $("#Dropdown-details").modal("show");
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

    $scope.fetchLife = function (id, subasset) {
        angular.forEach(subasset, function (value, key) {
            if (value.id == id) {
                $scope.form.life = value.life;
                $scope.form.assetLife = value.life;
            }
        });
    };

    $scope.salvageValueFinder = function (depreciableAsset, cost) {
        if (depreciableAsset == "true") {
            // Convert the cost to a double (if it's a string)
            var costAsDouble = parseFloat(cost);
            if (!isNaN(costAsDouble)) {
                // Conversion was successful
                $scope.form.salvageValue = (costAsDouble * 5) / 100; // Calculate and set the numeric value
                //console.log($scope.form.salvageValue);
            } else {
                // Conversion failed (cost is not a valid number)
                $scope.form.salvageValue = 0; // or any other appropriate value
            }
        }
    };

    $scope.addSaveAsset = function () {
        //console.log($scope.form);
        showHideLoad();
        if ($scope.form.id == "" || $scope.form.id == undefined) {
            var method = "POST";
            var url = "asset/createAsset";
        } else {
            var method = "PUT";
            var url = "asset/updateAsset";
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


    $scope.changeSerial = function (id) {
        Swal.fire({
            title: "Serial",
            html: '<input type="text" id="serialInput" placeholder="Serial" class="form-control">',
            showCancelButton: true,
            preConfirm: () => {
                const serialInput = document.getElementById("serialInput").value.trim();
                console.log(serialInput);
                if (!serialInput) {
                    Swal.showValidationMessage("Please enter a valid Serial");
                    return false;
                }
                return serialInput;
            },
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("Result: " + result.value);
                showHideLoad();
                $http({
                    method: "PUT",
                    params: { id: id, serial: result.value },
                    url: "asset/updateSerial",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    transformResponse: angular.identity,
                }).then(_success, _error);
            }
        });
    };
    
    

    function _success(response) {
        showHideLoad(true);
        $("#add_edit_Asset").modal("hide");
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

    $scope.editAsset = function (id) {
        showHideLoad();
        $http({
            method: "GET",
            params: { id: id },
            url: "asset/getAssetById",
        }).then(
            function successCallback(response) {
                // console.log(response.data);
                $scope.form = response.data;
                console.log($scope.form);

                $scope.fetchAssetType().then(function (assetTypeData) {
                    // Call $scope.typeFinder and wait for its completion
                    $scope.typeFinder($scope.form.type);

                    // Once $scope.typeFinder is completed, execute angular.forEach
                    angular.forEach($scope.entity[0].assetTypeDetail, function (val, key) {
                        if ($scope.form.hasOwnProperty(val.model) && !isNaN($scope.form[val.model]) && val.type === 'Numeric') {
                            $scope.form[val.model] = parseFloat($scope.form[val.model]);
                        }
                        // You can perform additional operations here if needed
                    });
                });

                // // An array of property names to convert to numbers
                // var propertiesToConvert = ["data01", "data02", "data03", "data04", "data05", "data06", "data07", "data08", "data09", "data10", "data11", "data12", "data13", "data14", "data15", "data16"];

                // for (var i = 0; i < propertiesToConvert.length; i++) {
                //     var key = propertiesToConvert[i];

                //     if ($scope.form.hasOwnProperty(key) && !isNaN($scope.form[key])) {
                //         $scope.form[key] = parseFloat($scope.form[key]);
                //     }
                // }
                $scope.fetchManufacture();
                $scope.fetchSuppliers();

                $("#add_edit_Asset").modal("show");
                // $scope.changeView("edit");
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
            url: "asset/toggleAssetActive",
            headers: {
                "Content-Type": "application/json",
            },
            transformResponse: angular.identity,
        }).then(
            function successCallback(response) {
                //console.log(response.data);
                autoAssetListFetch();
                showHideLoad(true);
            },
            function errorCallback(response) {
                //console.log(response.statusText);
            }
        );
    };

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
                    var url = "common/uploadExcelForAsset";

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

    $scope.getWarrantyEndDate = function (month) {

        var startDate = new Date($scope.form.warrantyStartDate);
        startDate.setMonth(startDate.getMonth() + $scope.form.warrantyMonth);

        // Format the date back to 'YYYY-MM-DD'
        var year = startDate.getFullYear();
        var month = (startDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based in JavaScript
        var day = startDate.getDate().toString().padStart(2, '0');

        $scope.form.warrantyEndDate = `${year}-${month}-${day}`;
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

app.controller("AssetAMCController", function ($scope, $http, $timeout, DTOptionsBuilder, $q) {
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
        showHideLoad();
        $http({
            method: "GET",
            url: "asset/getAssetsForAMC",
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

