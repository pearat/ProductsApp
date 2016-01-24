angular.module('carApp').factory('carSvc',['$http', function($http){

    var service = {};
    var scope = this;

    service.getYears = function (selected) {
        if (selected.startYears) {
            return $http.post('/api/Cars/GenerateYears').then(function (response) {
                return response.data;
            });
        }
        else {
            return $http.post('/api/Cars/GetModelYears',selected).then(function (response) {
                return response.data;
            });
        }
    }

    service.getMakes = function (selected) {
       
        if (selected.startYears) {
                return $http.post('/api/cars/getmakes4yr', selected).then(function (response) {
                        return response.data;
                });
        }
        else {
            return $http.post('/api/Cars/GetAllMakes', selected).then(function (response) {
                return response.data;
            });
        }
    }

    service.getModels = function (selected) {
        return $http.post('/api/Cars/GetModels', selected).then(
            function (response) {
                return response.data;
            }
        )
    }

    service.getTrims = function (selected) {
        
        return $http.post('/api/Cars/GetTrims', selected).then(
            function (response) {
                return response.data;
            }
        )
    }

    service.getRecallsPhotos = function (selected) {
        return $http.post('/api/Cars/getRecallsPhotos', selected).then(function (response) {
            return response.data;
        })
    }

    service.getCars = function (selected) {
        // $rootScope.progressing = true;
        // startSpin();
        console.log('-- Inside getCars() -- ');
        if (selected.year == '' && selected.make == '') {
            alert('Trying to get All Cars from database without specifying either year or make');
            return;
        } 
        return $http.post('/api/Cars/GetCars', selected).then(
            function (response) {
                // $rootScope.progressing = false;
                //stopSpin();
                return response.data;
            },
            function () {
                // error
                // selected.progressing = false;
                // stopSpin();
            }
        )
    }

    service.getDetails = function (id, scope) {
        // scope.progressing = true;
        
        return $http.post('/api/Cars/GetDetails', { id: id })
        .then(
            function (response) {
                response.data.recalls = $.parseJSON(response.data.recalls);
                // scope.progressing = false;
                return response.data;
            },
            function () {
                //error
                // scope.prograssing = false;
            }
        );
    }

    return service;
    
}])