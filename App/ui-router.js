var myapp = angular.module('myapp', ["ui.router"])

myapp.config(function ($stateProvider, $urlRouterProvider) {

    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/route1")

    $stateProvider
      .state('route1', {
          url: "/route1",
          templateUrl: "partials/route1.html"
      })
        .state('route1.list', {
            url: "/list",
            templateUrl: "partials/route1.list.html",
            controller: function ($scope) {
                $scope.pic = '';
             }
            //controller: function () {
            //    var scope = this;
            //    scope.pic = '';
            // }
      })

      .state('route2', {
          url: "/route2",
          templateUrl: "partials/route2.html"
        })
        .state('route2.list', {
            url: "/list",
            templateUrl: "partials/route2.list.html",
            controller: function ($scope) {
                $scope.things = ["A", "Set", "Of", "Things"];
        }
      })
})
