angular.module('carApp').factory('fakeSvc',['$q', function($q) {
    var service = {};

    service.getYears = function() {
        var deferred = $q.defer();
        deferred.resolve(['1999', '2000', '2001', '2002', '2003', '2004', '2005','2006']);
            return deferred.promise;
    };

    service.getMakes = function (year) {
        var deferred = $q.defer();
        switch (year) {
            case '1999': deferred.resolve(['amc', 'bmw', 'ford', 'gm']); break;
            case '2000': deferred.resolve(['amc', 'bmw', 'ford', 'gm', 'mercedes']); break;
            case '2001': deferred.resolve(['amc', 'bmw', 'ford', 'gm', 'honda', 'merc']); break;
            case '2002': deferred.resolve(['amc', 'bmw', 'ford', 'gm', 'honda', 'isuzu', 'merc']); break;
            case '2003': deferred.resolve(['amc', 'bmw', 'ford', 'gm', 'honda', 'isuzu', 'merc', 'saturn']); break;
            case '2004': deferred.resolve(['amc', 'bmw', 'ford', 'gm', 'honda', 'isuzu', 'merc', 'saturn']); break;
            case '2005': deferred.resolve(['amc', 'bmw', 'ford', 'gm', 'honda', 'isuzu', 'merc', 'saturn', 'tesla']); break;
            case '2006': deferred.resolve(['amc', 'bmw', 'ford', 'gm', 'honda', 'isuzu', 'merc', 'saturn', 'tesla']); break;
            default: deferred.resolve(['Year', 'not', 'initialized']);
        }
        return deferred.promise;
    };

    service.getModels = function (make) {
        var deferred = $q.defer();
        switch (make) {
            case 'amc':  deferred.resolve(['base']); break;
            case 'bmw':  deferred.resolve(['base','GT']); break;
            case 'ford': deferred.resolve(['base','GT', 'Sedan', ]); break;
            case 'gm':   deferred.resolve(['base','GT', 'Sedan', 'Coupe']); break;
            case 'honda':deferred.resolve(['base','GT', 'Sedan', 'Coupe', 'Sports']); break;
            case 'isuzu':deferred.resolve(['base','GT', 'Sedan', 'Coupe', 'Sports', 'Hatch-Back']); break;
            case 'merc': deferred.resolve(['base','GT', 'Sedan', 'Coupe', 'Sports', 'Hatch-Back', 'Wagon']); break;
            case 'saturn':deferred.resolve(['base','GT', 'Sedan', 'Coupe', 'Sports', 'Hatch-Back', 'Wagon','Convertible']); break;
            case 'tesla': deferred.resolve(['base', 'GT', 'Sedan', 'Coupe', 'Sports', 'Hatch-Back', 'Wagon', 'Convertible','Yowza']); break;
            default: deferred.resolve(['Base Model Only']);
        }
        return deferred.promise;
    };

    service.getTrims = function (trim) {
        var deferred = $q.defer();
        switch (trim) {
            case 'base':        deferred.resolve(['plastic']); break;
            case 'GT':          deferred.resolve(['plastic', 'leather']); break;
            case 'Sedan':       deferred.resolve(['plastic', 'leather', 'staid', ]); break;
            case 'Coupe':       deferred.resolve(['plastic', 'leather', 'staid', 'beach-bum']); break;
            case 'Sports':      deferred.resolve(['plastic', 'leather', 'staid', 'beach-bum', 'slick']); break;
            case 'Hatch-Back':  deferred.resolve(['plastic', 'leather', 'staid', 'beach-bum', 'slick', 'AFC']); break;
            case 'Wagon':       deferred.resolve(['plastic', 'leather', 'staid', 'beach-bum', 'slick', 'AFC', 'Fog']); break;
            case 'Convertible': deferred.resolve(['plastic', 'leather', 'staid', 'beach-bum', 'slick', 'AFC', 'Fog', 'Kitchen-Sink']); break;
            case 'Yowza':      deferred.resolve(['plastic', 'leather', 'staid', 'beach-bum', 'slick', 'AFC', 'Fog', 'Kitchen-Sink', 'Hollywood']); break;
            default: deferred.resolve(['Bare bones trim']);
        }
        return deferred.promise;
    };

    return service;
}]);
