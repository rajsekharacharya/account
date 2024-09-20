angular.module("Application")
    .controller("Dashboard", function ($scope, $http, $timeout) {
        showHideLoad(true);

        $scope.BarChartData = {
            labels: [], // x-axis labels (status)
            datasets: [
                {
                    label: "Weight(KG)",
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
                    label: "Weight(KG)",
                    data: [], // TotalWorking data
                    backgroundColor: [], // Random colors for each department
                    hoverBackgroundColor: [],
                    borderWidth: 1,
                    maxBarThickness: 25,
                },
            ],
        };

        // $scope.PieChartData = {
        //     labels: [], // department names
        //     datasets: [
        //         {
        //             data: [], // TotalWorking data
        //             backgroundColor: [], // Random colors for each department.
        //             hoverBackgroundColor: [],
        //             borderWidth: 1,
        //             maxBarThickness: 25,
        //         },
        //     ],
        // };

   //     autoLocationListFetch();
        function autoLocationListFetch() {
            showHideLoad();
            $http({
                method: "GET",
                url: "dashboard/getDashboardForPlant",
            }).then(
                function successCallback(response) {
                    //console.log(response);
                    $scope.data = response.data;

                    $scope.data.vendorData.forEach((item) => {
                        $scope.BarChartData.labels.push(item.vendor_name);
                        $scope.BarChartData.datasets[0].data.push(item.net_weight);
                        const randomColor = getRandomColor();
                        $scope.BarChartData.datasets[0].backgroundColor.push(randomColor);
                        $scope.BarChartData.datasets[0].hoverBackgroundColor.push(
                            randomColor
                        );
                    });

                    $scope.data.ItemData.forEach((item) => {
                        $scope.DoughnutChartData.labels.push(item.item);
                        $scope.DoughnutChartData.datasets[0].data.push(item.net_weight);

                        // Generate a random color for each department
                        const randomColor = getRandomColor();
                        $scope.DoughnutChartData.datasets[0].backgroundColor.push(
                            randomColor
                        );
                        $scope.DoughnutChartData.datasets[0].hoverBackgroundColor.push(
                            randomColor
                        );
                    });

                    // $scope.data.TypeWish.forEach((item) => {
                    //     $scope.PieChartData.labels.push(item.type);
                    //     $scope.PieChartData.datasets[0].data.push(item.Working);

                    //     // Generate a random color for each department
                    //     const randomColor = getRandomColor();
                    //     $scope.PieChartData.datasets[0].backgroundColor.push(randomColor);
                    //     $scope.PieChartData.datasets[0].hoverBackgroundColor.push(
                    //         randomColor
                    //     );
                    // });

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

            //const ctx2 = document.getElementById("myPieChart");

            // new Chart(ctx2, {
            //     type: "pie",
            //     data: $scope.PieChartData,
            //     options: {
            //         maintainAspectRatio: false,
            //         scales: {
            //             y: {
            //                 beginAtZero: true,
            //                 border: {
            //                     display: false, // base line
            //                 },
            //                 grid: {
            //                     display: false, //to hide vartical lines
            //                     drawTicks: false,
            //                 },
            //                 ticks: {
            //                     display: false, //this will show / remove only the label
            //                 },
            //             },
            //         },
            //         plugins: {
            //             legend: {
            //                 position: "bottom",
            //                 labels: {
            //                     boxWidth: 12,
            //                     boxHeight: 12,
            //                     padding: 15,
            //                     useBorderRadius: true,
            //                     borderRadius: 10,
            //                 },
            //             },
            //         },
            //     },
            // });
        }
    });