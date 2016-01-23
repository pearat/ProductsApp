
    (function () {
    
    

    var app = angular.module('carApp');
    app
        .filter('kph2mph', function () {
            return function (fieldValueUnused, car) {
                if (car == undefined) {
                    return '';
                } else {
                    return Math.round(car.top_speed_kph/ 1.61);         // liters per 100 kilometers
                }
            }
        })
        .filter('kg2lbs', function () {
            return function (fieldValueUnused, car) {
                if (car == undefined) {
                    return '';
                } else {
                    var k = car.weight_kg;
                    if (k ==0) return null;
                    var j = Math.round( k * 2.2, 0);
                    var m = j.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    console.log(' j: ' + j + ' m: ' + m); 
                    return m;
                }
            }
        })
        .filter('lkm2mpg', function () {
            return function (fieldValueUnused, car) {
                if (car == undefined) {
                    return '';
                } else {
                    lkm = car.lkm_city;         // liters per 100 kilometers
                    if (lkm == 0) return '';
                    var mpg = Math.round(2352.146 / lkm, 3)/10; // 100 * 3.78541178 / (1.609344 * lkm );
                    return mpg;
                }
            }
        })
        .filter('buyInUSA', function () {
            return function (fieldValueUnused, car) {
                if (car == undefined) {
                    return '';
                } else {
                    return (car.sold_in_us==1) ? 'Yes' : 'No';
                }
            }
        })

        .controller('carCtrl', ['carSvc', '$uibModal', function (carSvc, $uibModal) {
            var scope = this;

            scope.years = [];
            scope.makes = [];
            scope.models = [];
            scope.trims = [];
            scope.cars = [];
            scope.selected = {
                year: '',
                make: '',
                model: '',
                trim: '',
                sort: '3',
                startYears: true
            }

            

            scope.getMakes = function () {
                //if (!scope.selected.startYears) {
                //    scope.selected.year = '';
                //    scope.years = [];
                //    scope.makes = [];
                //    scope.cars = [];
                //}
                carSvc.getMakes(scope.selected).then(function (data) {
                    scope.makes = data;
                    //scope.models = [];
                    //scope.trims = [];
                    //scope.selected.make = '';
                    //scope.selected.model = '';
                    //scope.selected.trim = '';
                    if (scope.selected.startYears && scope.selected.year !== '') {
                        console.log('Inside getMakes() <<<');
                     //   scope.getCars();
                    }
                });
            }


            scope.getYears = function() { 
                //if (scope.selected.startYears) {
                //    scope.selected.make = '';
                //    scope.makes = [];
                //}
                carSvc.getYears(scope.selected).then(function (data) {
                    scope.years = data;
                    //scope.models = [];
                    //scope.trims = [];
                    //scope.selected.year = '';
                    //scope.selected.model = '';
                    //scope.selected.trim = '';   
                    if (!scope.selected.startYears && scope.selected.make !== '') {
                        console.log('>>>>> Inside getyears() ');
                     scope.getCars();
                    }
                });
            }

            scope.getModels = function () {
                carSvc.getModels(scope.selected).then(function (data) {
                    scope.models = data;
                    scope.trims = [];
                    scope.selected.model = '';
                    scope.selected.trim = '';
                    scope.getCars();
                });
        
            }

            scope.getTrims = function () {
                carSvc.getTrims(scope.selected).then(function (data) {
                    scope.trims = data;
                    scope.selected.trim = '';
                    scope.getCars();
                })
            }


            scope.getCars = function () {
                console.log('Inside getCars, year: ' + scope.selected.year + ' make: ' + scope.selected.make); 
                carSvc.getCars(scope.selected).then(function (data) {
                    scope.cars = data;
                })
            };

            scope.open = function (id) {
                console.log("Id in open " + id + ' type ' + typeof id);
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'carModal.html',
                    controller: 'carModalCtrl as cm',
                    size: 'lg',
                    resolve: {
                        car: function () {
                            return carSvc.getDetails(id);
                        }
                    }
                })
            };
    
            scope.changeSearchOrder = function () {
                var saveStart = scope.selected.startYears;
                $('input[name=startYears]').val([saveStart]);    
                scope.years = [];
                scope.makes = [];
                scope.models = [];
                scope.trims = [];
                scope.cars = [];
                scope.selected.year = '';
                scope.selected.make = '';
                scope.selected.model = '';
                scope.selected.trim = '';
                    
                scope.selected.startYears = saveStart;
                console.log('Inside changeSearchOrder(), yearSelect? ' + scope.selected.startYears+ ' saveStart: '+saveStart);
                if (scope.selected.startYears) {
                    scope.getYears();
                } else {
                    scope.getMakes();
                }
            };

            //$(document).ready(
            //    function () {
            //        $('input[name=startYears]').val([true]);

            //});

            scope.changeSearchOrder(scope.selected.startYears);
    }]);


    angular.module('carApp').controller('carModalCtrl', ['$uibModalInstance', 'car', function ($uibModalInstance, car) {
        var scope = this;
        scope.n = 0;
        scope.car = car;  // includes recall, pic and car record
        //scope.cArray = [];
        //console.log('image URL: ' + car.image);
        //console.log('car.car.model_name ' + car.car.model_name);
        //console.log('car.recalls.Count ' + car.recalls.Count);
        //for (i = 0; i < car.recalls.Count; i++) {
        //    console.log('Component ' + car.recalls.Results[i].Component);
        //    scope.cArray[i].Component = car.recalls.Results[i].Component;
        //    scope.cArray[i].Summary = car.recalls.Results[i].Summary;
        //    scope.cArray[i].Date = car.recalls.Results[i].DateOfIncident;
        //    scope.cArray[i].ODI = car.recalls.Results[i].ODINumber;

        //}
        // scope.car.cArray = car.recalls.Results[0].Component;

        if ( angular.isArray(car.recalls.Results) ) {
            scope.complaints = car.recalls.Results;
        }
        else {
            scope.complaints = [car.recalls.Results];
        }

        scope.ok = function () {
            $uibModalInstance.close();
        };
        scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
})();
