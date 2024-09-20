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