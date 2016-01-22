angular.module('carApp').factory('carSvc',['$http', function($http){

    var service = {};

    service.getYears = function (selected) {
        if (selected.make === '') {
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
        return $http.post('/api/Cars/GetMakes', selected).then(
            function (response) {
                return response.data;
            }
        )
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

        return $http.post('/api/Cars/GetCars',selected).then(function (response) {
            return response.data;
        })
    }

    service.getDetails = function (id) {
        console.log('Inside GetDetails, id: '+ id+' typeof '+ typeof id);
        return $http.post('/api/Cars/GetDetails', { id: id }).then(function (response) {
            return response.data;
        })
    }

    return service;
}])