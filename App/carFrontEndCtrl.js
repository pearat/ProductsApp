(function(){
    var app = angular.module('carApp');
    app.controller('carCtrl', ['carSvc','$uibModal', function (carSvc, $uibModal) {
    
        var scope = this;
        scope.startYears = true;
        scope.years = [];
        scope.makes = [];
        scope.models = [];
        scope.trims = [];
        scope.selected = {
            year: '',
            make: '',
            model:'',
            trim: '',
            sort: ''
        }
        scope.pic = 'COOL PHOTO';

        scope.cars = [];
        //scope.car = Object;

        scope.getCars = function () {
            console.log('Inside getCars');
            carSvc.getCars(scope.selected).then(function (data) {
                scope.cars = data;
            })
        };

        scope.getYears = function() { 
            carSvc.getYears(scope.selected).then(function (data) {
                scope.years = data;
                scope.makes = [];
                scope.models = [];
                scope.trims = [];
                scope.selected.year = '';
                // scope.selected.make = '';
                scope.selected.model = '';
                scope.selected.trim = '';
            });
        }

        if (scope.selected.make === '') {
            scope.getYears();
        };

        scope.getMakes = function() { 
            // scope.years = ['1986','1987','1988','1989'];
            // fakeSvc.getMakes(scope.selected.year).then(function (data) {
            carSvc.getMakes(scope.selected).then(function (data) {
                scope.makes = data;
                scope.models = [];
                scope.trims = [];
                scope.selected.make = '';
                scope.selected.model = '';
                scope.selected.trim = '';
                scope.getCars();
            });
        }

        scope.getModels = function () {
            // fakeSvc.getModels(scope.selected.make).then(function (data) {
            // scope.models = data;
            carSvc.getModels(scope.selected).then(function (data) {
                //$.map(data, function (car, i){
                //        scope.models[i] = $(car.model_name);
                //        });
                scope.models = data;
                scope.trims = [];
                scope.selected.model = '';
                scope.selected.trim = '';
                scope.getCars();
            });
        
        }

        scope.getTrims = function () {
            //console.log("Entering getTrims");
            // fakeSvc.getTrims(scope.selected.model).then(function (data) {
        
            carSvc.getTrims(scope.selected).then(function (data) {
                scope.trims = data;
                //scope.selected.sort = '3';
                //scope.getCars();
                //$.map(scope.cars, function (car, i){
                //    scope.trims[i] = $(car.model_name);
                //});
                scope.selected.trim = '';
                scope.getCars();
            })
        }

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
            })};
    
    
    }]);


    angular.module('carApp').controller('carModalCtrl', ['$uibModalInstance', 'car', function ($uibModalInstance, car) {
        var scope = this;
        scope.n = 0;
        scope.car = car;  // includes recalls, pic and car record
        console.log('image URL: ' + car.image);
        console.log('car.car.model_name ' + car.car.model_name);

        scope.modalPic = 'PICTURE FROM INSIDE MODAL CTRL';

        scope.ok = function () {
            $uibModalInstance.close();
        };
        scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);


})();


//.then(function (data) {
                            
//    var nhtsa = data.recalls;
//    scope.car = data.car;
//    console.log('nhtsa: ' + nhtsa);
//    var count = nhtsa.Count;
//    console.log('RECALLS = [' + nhtsa.Count + '] DATA.summary image[' + data.image + ']');
//    scope.demoPic = 'PICTURE FROM OUTSIDE MODAL CTRL';
//    var carPicsTag = $('#carPics');
//    var picLink = new String;
//    picLink = '';
//    if (data.image == '') {
//        carPicsTag.append("No image found!");
//    }
//    else {
//        var    = $($('#carPics')).closest('div').find('img').first();
//        img.remove();
//        picLink = '<img src="' + data.image + '" alt="Car Picture" style="width:304px;height:228px;">';
//        console.log('>>>pickLink>>' + picLink + '<<<<');
//        carPicsTag.append(picLink);
//    }
//    console.log('count: ' + count);
//    if (count === undefined) {
//        $('#recallData').text("UNDEFINED");
//    } else if (count === 0) {
//        $('#recallData').text("No recalls available from NTHSA");
//    }
//    else {
//        var recallTag = $('#recallData');
//        while (recallTag.lastChild) {
//            recallTag.removeChild(recallTag.lastChild);
//        }

//        var value = new String;
//        value = '';
//        var optionsHtml = new Array();
//        for (i = 0; i < count; i++) {
//            // console.log('Summary[' + i + '] >>> ' + nhtsa.Results[i].Summary + '<<<');
//            optionsHtml.push('<h6 >' + nhtsa.Results[i].Component + "</h6>");
//            optionsHtml.push('<p class="plain">' + nhtsa.Results[i].Summary + "</p>");
//        }
//        optionsHtml = optionsHtml.join('');

//        recallTag.append(optionsHtml);


        
