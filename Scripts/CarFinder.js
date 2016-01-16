$(document).ready(function () {

    initializeErrors();

    yearSlider(1936, 2015, 1988);  // replace w/ API call for min & max

    $('#yearSlider').on('mouseleave', function () {

        getMakes($('#year').val());

    });

    $('#makeSlider').on('mouseleave', function () {

        getModels($('#year').val(),$('#model').val());

    });
});


function modelSlider(xml) {
    data = xml;
    console.log('data in modelSlider:' + data + '\n typeof' + typeof data + 'length ' + data.length);
    var i = 0;
    var modelsArray = [];
    $(data).find('model_name').each(function () {
        modelsArray[i] = $(this).text();
        console.log('modelsArray = ' + modelsArray[i]);
        i++;
    });
    var j = modelsArray.length;
    
    $('#model').val(modelsArray[0]);
    $('#model').css('visibility', 'hidden');
    $('#modelSlider').slider({
        // orientation: 'vertical',
        range: 'min',
        min: 0,
        max: j,
        value: Math.round(j / 2, 0),
        slide: function (event, ui) {
            $('#model').val(modelsArray[ui.value]);
            $('#model').css('visibility', 'visible');
        },
        stop: function (event, ui) {
            // what to do after exiting slider
        }
    });
    $('#model').val($('#modelSlider').slider('value'));
};

function getModels(year,make) {
        
    var _year = year || '';
    var _make = make || '';
    var http = 'http://localhost:57795/api/cars/full?year=' + _year +
        '&make=' + _make + '&model=&trim=&sort=2';
    
    console.log('getModels search string>>>' + http + '<<<');
    var modelsArray = [];

    $.ajax({
        url: http,
        dataType: 'xml',
        error: function(xhr, error){
            console.debug(xhr); console.debug(error);
            modelsArray = NULL;
        },
        
        type: 'GET',
        success: function (data) {
            var div = $('#models');
            console.log('getModels data in success:' + data + '\n typeof' + typeof data + 'length ' + data.length);
            var i = 0;
            $(data).find('model_name').each(function() {
                modelsArray[i] = $(this).text();
                console.log('modelsArray = ' + modelsArray[i]);
                i++;
            });
            modelSlider(data);

        }
    }).done(function (data) {
        // var x = data.getElementsByTagName('string');
        console.log('Exiting get models: length of makesArr: ' + modelsArray.length + ' typeof: ' + typeof modelsArray);
    });

}


function yearSlider(yr_first, yr_last, yr_start) {
    console.log('Inside year Slider');
    $('#yearSlider').slider({
        // orientation: 'vertical',
        range: 'min',
        min: yr_first,
        max: yr_last,
        value: yr_start,
        slide: function (event, ui) {
            $('#year').val(ui.value);  
        },
        stop: function( event,ui) {
            // what to do after exiting slider
        }
    });
    $('#year').val($('#yearSlider').slider('value'));
};

function makeSlider(xml) {
    data = xml;
    var i = 0;
    var makesArray = [];
    $(data).find('string').each(function () {
        makesArray[i] = $(this).text();
        // console.log('makesArray = ' + makesArray[i]);
        i++;
    });
    var j = makesArray.length;
    
    $('#make').val(makesArray[0]);
    $('#make').css('visibility', 'hidden');
    $('#makeSlider').slider({
        // orientation: 'vertical',
        range: 'min',
        min: 0,
        max: j,
        value: Math.round(j/2,0),
        slide: function (event, ui) {
            $('#make').val(makesArray[ui.value]);
            $('#make').css('visibility', 'visible');
        },
        stop: function (event, ui) {
            // what to do after exiting slider
        }
    });
    $('#make').val($('#makeSlider').slider('value'));
};

     function getMakes(year) {
        
         var _year = year || '';
         var http = 'http://localhost:57795/api/cars/makes?year=' + _year;
         // console.log('search string>>>' + http + '<<<');
         var makesArray = [];

         $.ajax({
             url: http,
             dataType: 'xml',
             error: function(xhr, error){
                 console.debug(xhr); console.debug(error);
                 makesArray = NULL;
             },
             // jsonpCallback: 'callback',
             type: 'GET',
             success: function (data) {
                 var div = $('#makes');
                     var i = 0;
                 $(data).find('string').each(function() {
                     makesArray[i] = $(this).text();
                     // console.log('makesArray = ' + makesArray[i]);
                     i++;
                 });
                 makeSlider(data);

             }
         }).done(function (data) {
//             var x = data.getElementsByTagName('string');
             console.log('Exiting get makes: length of makesArr: ' + makesArray.length + ' typeof: ' + typeof makesArray);
         });

     }



     //$(function initializeErrors() {
     function initializeErrors() {
         console.log('Inside initialize Errors');
         // alert('Inside ajax setup');
         $.ajaxSetup({
             error: function (jqXHR, exception) {
                 if (jqXHR.status === 0) {
                     alert('Not connect.\n Verify Network.');
                 } else if (jqXHR.status == 404) {
                     alert('Requested page not found. [404]');
                 } else if (jqXHR.status == 500) {
                     alert('Internal Server Error [500].');
                 } else if (exception === 'parsererror') {
                     alert('Requested JSON parse failed.');
                 } else if (exception === 'timeout') {
                     alert('Time out error.');
                 } else if (exception === 'abort') {
                     alert('Ajax request aborted.');
                 } else {
                     alert('Uncaught Error.\n' + jqXHR.responseText);
                 }
             }
         });
     };

     
     function getRecalls(year, make, model) {
         var http = 'http://www.nhtsa.gov/webapi/api/Recalls/vehicle/year/2006/make/acura/model/MDX?format=json';

         $.ajax({
             url: http,
             dataType: 'jsonp',
             jsonpCallback: 'callback',
             type: 'GET',
             success: function (data) {
                 var div = $('#data');
                 for (var i = 0; i < data.Results.length; i++) {
                     $(div).append('<div>' + data.Results[i].Component + ' ' +
                         +data.Results[i].year + ' ' +
                         +data.Results[i].Conequence + '</div>');
                 }
             }
         }).done(function (data) {
             // if (console && console.log) {
             console.log('Sample of data:' + data); //.slice(0, 100));

             // }
         });
     }
