(function(){
    var app = angular.module('planetsApp', [require('angular-ui-router')]);

    app.controller('mercuryCtrl', ['$interval', function ($interval) {
        var scope = this;   // refers to the current code block
        //scope.name = 'Ria';
        //scope.names = ['Abby', 'Dan', 'Chris', 'Jamie'];
        //scope.time = new Date();
        //scope.selectedColor = 'Orange';
        //var ms = 5000; // milisections
        //$interval(function () {
        //    scope.time = new Date();
        //}, ms);
        scope.click = function () {
            scope.selectedColor = 'red';
        }
    }]);
})();

