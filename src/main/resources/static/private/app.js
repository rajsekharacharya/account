angular.module("Application", ["datatables", "datatables.buttons",]);

// DIRECTIVE - Multi TAB
angular.module('Application').directive("showtab", function () {
  return {
    link: function (scope, element, attrs) {
      element.click(function (e) {
        e.preventDefault();
        $(element).tab("show");
      });
    },
  };
});

// Define the custom filter in your AngularJS module
angular.module('Application').filter('timeFormat', function() {
  return function(input) {
      if (!input) return input;

      // Split the time by '.' to separate the seconds and nanoseconds
      var timeParts = input.split('.');
      var formattedTime = timeParts[0]; // Take the time part (HH:mm:ss)

      return formattedTime; // Return formatted time
  };
});


// DIRECTIVE - FILE MODEL
angular.module('Application').directive("fileModel", [
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