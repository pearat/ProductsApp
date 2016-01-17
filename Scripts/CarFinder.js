$(document).ready(function () {

    initializeErrors();

    slideYears(1936, 2015, 1988);  // replace w/ API call for min & max

    $('#slideYears').on('mouseleave', function () {
        getMakes($('#year').val());
    });
    
    $('#slideMakes').on('mouseleave', function () {
        getModels($('#year').val(),$('#make').val());
    });

    $('#slideModels').on('mouseleave', function () {
        getTrims($('#year').val(), $('#make').val(), $('#model').val());
    });

    function hexFromRGB(r, g, b) {
        var hex = [
          r.toString(16),
          g.toString(16),
          b.toString(16)
        ];
        $.each(hex, function (nr, val) {
            if (val.length === 1) {
                hex[nr] = "0" + val;
            }
        });
        return hex.join("").toUpperCase();
    }
    function refreshSwatch() {
        var red = $("#red").slider("value"),
          green = $("#green").slider("value"),
          blue = $("#blue").slider("value"),
          hex = hexFromRGB(red, green, blue);
        $("#swatch").css("background-color", "#" + hex);
    }
    $(function () {
        $("#red, #green, #blue").slider({
            orientation: "horizontal",
            range: "min",
            max: 255,
            value: 127,
            slide: refreshSwatch,
            change: refreshSwatch
        });
        $("#red").slider("value", 255);
        $("#green").slider("value", 140);
        $("#blue").slider("value", 60);
    });

});






function getTrims(year, make, model) {

    var _year = year || '';
    var _make = make || '';
    var _model = model || '';
    var http = 'http://localhost:57795/api/cars/full?year=' + _year +
        '&make=' + _make +
        '&model=' + _model + '&trim=&sort=2';

    console.log('GET TRIMS search string>>>' + http + '<<<');
    var trimsArray = [];

    $.ajax({
        url: http,
        dataType: 'xml',
        error: function (xhr, error) {
            console.debug(xhr); console.debug(error);
            trimsArray = NULL;
        },

        type: 'GET',
        success: function (data) {
            var div = $('#trims');
            console.log('gettrims data in success:' + data + '\n typeof' + typeof data + 'length ' + data.length);
            var i = 0;
            $(data).find('model_trim').each(function () {
                trimsArray[i] = $(this).text();
                console.log('inside GET TRIMS trimsArray >> ' + trimsArray[i]);
                i++;
            });
            slideTrims(data);

        }
    }).done(function (data) {
        console.log('Exiting get trims: length of makesArr: ' + trimsArray.length + ' typeof: ' + typeof trimsArray);
    });
}

function slideTrims(data) {

    console.log('data in TRIM Slider:' + data + '\n typeof' + typeof data + 'length ' + data.length);
    var i = 0;
    var trimsArray = [];
    $(data).find('model_trim').each(function () {
        trimsArray[i] = $(this).text();
        console.log('within SLIDER trimsArray = ' + trimsArray[i]);
        i++;
    });
    var j = trimsArray.length;

    $('#trim').val(trimsArray[0]);
    $('#trim').css('visibility', 'hidden');
    $('#slideTrims').slider({
        // orientation: 'vertical',
        range: 'min',
        min: 0,
        max: j,
        value: 0,
        slide: function (event, ui) {
            $('#trim').val(trimsArray[ui.value]);
            $('#trim').css('visibility', 'visible');
        },
        stop: function (event, ui) {
            // what to do after exiting slider
        }
    });
    $('#trim').val($('#slideTrims').slider('value'));
};



function getModels(year, make) {
        
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
            // console.log('getModels data in success:' + data + '\n typeof' + typeof data + 'length ' + data.length);
            var i = 0;
            $(data).find('model_name').each(function() {
                modelsArray[i] = $(this).text();
                // console.log('modelsArray >> ' + modelsArray[i]);
                i++;
            });
            slideModels(data);

        }
    }).done(function (data) {
        // var x = data.getElementsByTagName('string');
        //console.log('Exiting get models: length of makesArr: ' + modelsArray.length + ' typeof: ' + typeof modelsArray);
    });

}

function slideModels(data) {

    // console.log('data in slideModels:' + data + '\n typeof' + typeof data + 'length ' + data.length);
    var i = 0;
    var modelsArray = [];
    $(data).find('model_name').each(function () {
        modelsArray[i] = $(this).text();
        // console.log('within SLIDER modelsArray = ' + modelsArray[i]);
        i++;
    });
    var j = modelsArray.length;

    $('#model').val(modelsArray[0]);
    $('#model').css('visibility', 'hidden');
    $('#slideModels').slider({
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
    $('#model').val($('#slideModels').slider('value'));
};


function getMakes(year) {

    var _year = year || '';
    var http = 'http://localhost:57795/api/cars/makes?year=' + _year;
    // console.log('search string>>>' + http + '<<<');
    var makesArray = [];

    $.ajax({
        url: http,
        dataType: 'xml',
        error: function (xhr, error) {
            console.debug(xhr); console.debug(error);
            makesArray = NULL;
        },
        // jsonpCallback: 'callback',
        type: 'GET',
        success: function (data) {
            var div = $('#makes');
            var i = 0;
            $(data).find('string').each(function () {
                makesArray[i] = $(this).text();
                // console.log('makesArray = ' + makesArray[i]);
                i++;
            });
            slideMakes(data);

        }
    }).done(function (data) {
        //             var x = data.getElementsByTagName('string');
        console.log('Exiting get makes: length of makesArr: ' + makesArray.length + ' typeof: ' + typeof makesArray);
    });

}


function slideMakes(xml) {
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
    $('#slideMakes').slider({
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
    $('#make').val($('#slideMakes').slider('value'));
};


function slideYears(yr_first, yr_last, yr_start) {
    console.log('Inside year Slider');
    $('#slideYears').slider({
        // orientation: 'vertical',
        range: 'min',
        min: yr_first,
        max: yr_last,
        value: yr_start,
        slide: function (event, ui) {
            $('#year').val(ui.value);
        },
        stop: function (event, ui) {
            // what to do after exiting slider
        }
    });
    $('#year').val($('#slideYears').slider('value'));
};

//$(function initializeErrors() {
function initializeErrors() {
    // console.log('Inside initialize Errors');
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
