(function () {
    var app = angular.module('carApp');

   
    app.filter('kph2mph', function () {
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
        .controller('carCtrl', ['carSvc', '$uibModal', 'usSpinnerService','$rootScope', 
            function (carSvc, $uibModal, usSpinnerService, $rootScope) {
            var scope = this;

            /* ****************************** /
            
            scope.startcounter = 0;
            scope.startSpin = function () {
                if (!scope.spinneractive) {
                    usSpinnerService.spin('spinner-1');
                    scope.startcounter++;
                }
            };

            scope.stopSpin = function () {
                if (scope.spinneractive) {
                    usSpinnerService.stop('spinner-1');
                }
            };
            scope.spinneractive = true;

            $rootScope.$on('us-spinner:spin', function (event, key) {
                scope.spinneractive = true;
            });

            $rootScope.$on('us-spinner:stop', function (event, key) {
                scope.spinneractive = false;
            });

            /******************************* */

            scope.isLoading = false;
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
                sort: '',
                startYears: true,
                progressing: true
            }

            scope.getMakes = function () {

                carSvc.getMakes(scope.selected).then(function (data) {
                    scope.makes = data;
                    if (scope.selected.year !== '' || scope.selected.make !== '')
                        scope.getCars();
                     
                });
            }


            scope.getYears = function() { 

                carSvc.getYears(scope.selected).then(function (data) {
                    scope.years = data;
                    if (scope.selected.year !=='' || scope.selected.make !== '') 
                        scope.getCars();
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
                //scope.startSpin();
                console.log('Inside getCars, year: ' + scope.selected.year + ' make: ' + scope.selected.make); 
                
                carSvc.getCars(scope.selected).then(function (data) {
                    scope.cars = data;
                });
                // .scope.stopSpin(); 
                
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
    
            scope.changeSearchOrder = function (byYear) {
                scope.selected.startYears = byYear;
                //var saveStart = scope.selected.startYears;
                //$('input[name=startYears]').val([saveStart]);    
                scope.years = [];
                scope.makes = [];
                scope.models = [];
                scope.trims = [];
                scope.cars = [];
                scope.selected.year = '';
                scope.selected.make = '';
                scope.selected.model = '';
                scope.selected.trim = '';
                //scope.selected.startYears = saveStart;
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


    app.filter('divideBy', function () {
            return function (input, divisor) {
                input = input || 0;
                if (input == 0) return '';
                divisor = divisor || 1;
                return Math.round(input / divisor);
            }
        })
        .filter('multiplyBy', function () {
            return function (input, operand) {
                input = input || 0;
                if (input == 0) return '';
                operand = operand || 1;
                return Math.round(input * operand);
            }
        })
        .filter('yesFor1', function () {
            return function (input) {
                if (input = 1) {
                    return 'Yes';
                } else {
                    return 'No';
                }
            }
        })
        .filter('inverseX', function () {
            return function (input, x) {
                if (input == '' || input == 1) return '';
                x = x || 1;
                return Math.round(x / input);
            }
        })
        .controller('carModalCtrl', ['$uibModalInstance', 'car', function ($uibModalInstance, car) {
            var scope = this;
            scope.n = 0;
            scope.car = car;
            var ct = car.recalls.Count;
            if (car.car.make_display == '')
                car.car.make_display = car.car.make;
            console.log('car.recalls.Count ' + ct);
            //if (ct > 1) {
            //    var arr = [];
            //    for (i = 0; i < ct; i++)
            //        arr[i] = car.recalls.Results[i];
            //    arr.sort(arr[i].ReportReceivedDate);
            //    car.recalls.Results = arr;
            //}
            var jsonDate = dateString = '';
            for (i = 0; i < ct; i++) {
                jsonDate = $.trim(car.recalls.Results[i].ReportReceivedDate);
                dateString = parseJsonDate(jsonDate);
                // console.log('*** jsonDate:>' + jsonDate + '<:***:>' + dateString + '<:***');
                car.recalls.Results[i].ReportReceivedDate = dateString;
            }
            scope.ok = function () {
                $uibModalInstance.close();
            };
            scope.cancel = function () {
                $uibModalInstance.dismiss();
            };


        /* vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv */

            scope.oneAtATime = true;

            scope.groups = [
            {
                title: 'Dynamic Group Header - 1',
                content: 'Dynamic Group Body - 1'
            },
            {
                title: 'Dynamic Group Header - 2',
                content: 'Dynamic Group Body - 2'
            }
            ];

            scope.items = ['Item 1', 'Item 2', 'Item 3'];

            scope.addItem = function () {
                var newItemNo = scope.items.length + 1;
                scope.items.push('Item ' + newItemNo);
            };

            scope.status = {
                isFirstOpen: true,
                isFirstDisabled: false
            };
        
        /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */

    }]);


})();




//function SortByDate(a, b) {
//    var aDate = a.ReportReceivedDate;
//    var bDate = b.ReportReceivedDate;
//    return ((aDate < bDate) ? -1 : ((aDate > bDate) ? 1 : 0));
//}


function parseJsonDate(jsonDateString) {

    var a = new Date(parseInt(jsonDateString.replace('/Date(', '')));
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    //var hour = a.getHours();
    //var min = a.getMinutes();
    //var sec = a.getSeconds();
    var calendarDate = date + ' ' + month + ' ' + year;
    return calendarDate;
}
