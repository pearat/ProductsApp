$(document).ready(function () {

    initializeErrors();

    slideYears(1936, 2015, 2000);  // replace w/ API call for min & max

    $('#slideYears').on('slidechange', function () {
        getMakes($('#year').val());
    });
    
    $('#slideMakes').on('slidechange', function () {
        $('#model option:not(:first)').remove();
        getModels($('#year').val(),$('#make').val());
    });

    // var carsArray = [];
    var data;
   /*
    $('#dropdownModels').on('change', function () {
        //$('#modelChoice').val($('#model'));
        //$('#trim option:not(:first)').remove();
        // getTrims($('#year').val(), $('#make').val(), $('#modelChoice').val(), carsArray);

        var i = carsArray.length;
        console.log('In main LOOP carsArray length: ' + carsArray.length + ' i = ' + i);
        for (j = 0; j < i; j++) {
            console.log(' In main LOOP ['+j+'] ' + ': id ' + carsArray[j].id + '\n' 
            + ': make ' + carsArray[j].make_display + ': model ' + carsArray[j].model_name
            + ': year ' + carsArray[j].model_year + ': trim ' + carsArray[j].model_trim
            + ': engine_cc ' + carsArray[j].engine_cc + ': wheelbase ' + carsArray[j].wheelbase
            );
        }
    });

    
    $('#trim').on('mouseleave', function () {

    });
    */
});


function getTrims(year, make, model) {

    var _year = year || '';
    var _make = make.toLowerCase() || '';
    var _model = model || '';
    var http = 'http://localhost:57795/api/cars/full?year=' + _year +
        '&make=' + _make +
        '&model=' + _model + '&trim=&sort=2';

    console.log('GET TRIMS search string>>>' + http + '<<<');
    var trimsArray = [];
    var carsArray = new Array;
    $.ajax({
        url: http,
        dataType: 'xml',
        error: function (xhr, error) {
            console.debug(xhr); console.debug(error);
            trimsArray = NULL;
        },
        type: 'GET',
        success: function (data) {
            var select = $('#trim');
            var optionsHtml = new Array();
            $('#trim option:not(:first)').remove();
            $('model_trim', data).each(function () {
                var value = $(this).attr('value');
                var label = $(this).text();
                optionsHtml.push("<option class='ddindent' value='" +
                    value + "'>" + label + "</option>");
            });
            optionsHtml = optionsHtml.join('');
            select.append(optionsHtml);
            select.children(":first").text("Select Trim").attr("selected", true);
  
            $('#dropdownTrims').change( function () {
                var choice = $('#dropdownTrims :selected').text();
                $('#trimChoice').val(choice);
                $('#trimChoice').text(choice);
            });
  
            
            $('#trim').on('change', function () {

                var i = 0;
                $('Car', data).each(function () {
                    var car = new Object;
                    car = {
                        body_style: $('body_style', this).text(),
                        co2: $('co2', this).text(), 
                        drive_type: $('drive_type',this).text(),
                        engine_bore_mm: $('engine_bore_mm', this).text(),
                        engine_cc: $('engine_cc', this).text(),
                        engine_compression: $('engine_compression', this).text(),
                        engine_fuel: $('engine_fuel', this).text(),
                        engine_num_cyl: $('engine_num_cyl', this).text(),
                        engine_position: $('engine_position', this).text(),
                        engine_power_ps: $('engine_power_ps', this).text(),
                        engine_power_rpm: $('engine_power_rpm', this).text(),
                        engine_stroke_nm: $('engine_stroke_nm', this).text(),
                        engine_torque_nm: $('engine_torque_nm', this).text(),
                        engine_torque_rpm: $('engine_torque_rpm', this).text(),                        
                        engine_type: $('engine_type', this).text(),
                        engine_valves_per_cyl: $('engine_valves_per_cyl', this).text(),
                        fuel_capacity_l: $('fuel_capacity_l', this).text(),
                        height_mm: $('height_mm', this).text(),
                        id: $('id', this).text(),
                        length_mm: $('length_mm', this).text(),
                        lkm_city: $('lkm_city', this).text(),
                        lkm_hwy: $('lkm_hwy', this).text(),
                        lkm_mixed: $('lkm_mixed', this).text(),
                        make: $('make', this).text(),
                        make_display: $('make_display', this).text(),
                        model_name: $('model_name', this).text(),
                        model_trim: $('model_trim', this).text(),
                        model_year: $('model_year', this).text(),
                        seats: $('seats', this).text(),
                        sold_in_us: $('sold_in_us', this).text(),
                        top_speed_kph: $('top_speed_kph', this).text(),
                        transmission_type: $('transmission_type', this).text(),
                        weight_kg: $('weight_kg', this).text(),
                        wheelbase: $('wheelbase', this).text(),                        
                        width_mm: $('width_mm', this).text(),                        
                        zero_to_100_kph: $('zero_to_100_kph', this).text()

                    };
                    carsArray[i++] = car;

                   // recalls = getRecalls($('#year').val(), $('#make').val(), $('#model').val());


                });

                console.log('length of carsArray: ' + carsArray.length + ' i = ' + i);
                for (j = 0; j < i; j++) {

                    console.log(' In Get TRIMS carsArray['+j+'] '
                    + ': id ' + carsArray[j].id + ' ' 
                    + ': model ' + carsArray[j].model_name
                    + ': trim ' + carsArray[j].model_trim
                    // + ': engine_cc ' + carsArray[j].engine_cc
                    // + ': wheelbase ' + carsArray[j].wheelbase
                    );
                }

                return carsArray;
            });  
        }
    }).done(function (data) {

    });
}


function getModels(year, make) {
    
    var _year = year || '';
    var _make = make.toLowerCase() || '';
    var http = 'http://localhost:57795/api/cars/full?year=' + _year +
        '&make=' + _make + '&model=&trim=&sort=2';
    
    console.log('GET MODELS search string>>>');// + http + '<<<');
    var modelsArray = [];

    $.ajax({
        url: http,
        dataType: 'xml',
        type: 'GET',
        error: function(xhr, error){
            console.debug(xhr); console.debug(error);
            modelsArray = NULL;
        },

        success: function (data) {

            var select = $('#model');
            var optionsHtml = new Array();
            var old_label = '';
            var value = '';
            $(data).find('model_name').each(function () {
                var value = $(this).attr('value');
                var label = $(this).text();
                if (old_label != '' && label != old_label) {
                    optionsHtml.push("<option class='ddindent' value='"
                        + value + "'>" + label + "</option>");
                }
                old_label = label;
            });
            optionsHtml = optionsHtml.join('');
            select.append(optionsHtml);
            select.children(":first").text("Select Model").attr("selected", true);
           
            $('#dropdownModels').change(function () {
                
                var choice = $('#dropdownModels :selected').text();
                $('#modelChoice').val(choice);
                $('#modelChoice').text(choice);
  
                getTrims($('#year').val(), $('#make').val(), $('#modelChoice').val());
            });

        }
    }).done(function (data) {
        //console.log('Exiting get models: length of makesArr: ' + modelsArray.length + ' typeof: ' + typeof modelsArray);
    });

}

/*
function slideModels(data) {
    console.log('Entering SLIDE MODELS:');// + data + '\n typeof' + typeof data + 'length ' + data.length);
    var i = 0;
    var modelsArray = [];
    $(data).find('model_name').each(function () {
        modelsArray[i] = $(this).text();
        // console.log('within SLIDER modelsArray = ' + modelsArray[i]);
        i++;
    });
    
    $('#model').val(modelsArray[0]);
    $('#model').css('visibility', 'hidden');
    $('#dropdownModels').slider({
        // orientation: 'vertical',
        range: 'min',
        min: 0,
        max: modelsArray.length,
        value: 0,
        slide: function (event, ui) {
            $('#model').val(modelsArray[ui.value]);
            $('#model').css('visibility', 'visible');
        },
        stop: function (event, ui) {
            // what to do after exiting slider
        }
    });
    $('#model').val($('#dropdownModels').slider('value'));
};
*/

function getMakes(year) {

    var _year = year || '';
    var http = 'http://localhost:57795/api/cars/makes?year=' + _year;
    console.log('GET MAKES search string>>>');// + http + '<<<');
    var makesArray = [];

    $.ajax({
        url: http,
        dataType: 'xml',
        error: function (xhr, error) {
            console.debug(xhr); console.debug(error);
            makesArray = NULL;
        },
        type: 'GET',
        success: function (data) {

            slideMakes(data);

        }
    }).done(function (data) {
        
        // console.log('Exiting get makes: length of makesArr: ' + makesArray.length + ' typeof: ' + typeof makesArray);
    });

}


function slideMakes(xml) {
    console.log("Entering SLIDE MAKES");
    data = xml;
    var i = 0;
    var makesArray = [];
    $(data).find('string').each(function () {
        makesArray[i] = $(this).text();
        // console.log('makesArray = ' + makesArray[i]);
        i++;
    });

    $('#make').val(makesArray[0]);
    $('#make').css('visibility', 'hidden');
    var j = makesArray.length;
    $('#slideMakes').slider({
        // orientation: 'vertical',
        range: 'min',
        min: 0,
        max: j,
        value: Math.round(j/2),
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
    console.log('Entering SLIDE YEARS');
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


function initializeErrors() {
    // console.log('Inside initialize Errors');
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

    var _year = year || '';
    var _make = make || '';
    var _model = model || '';

    // var http = 'http://www.nhtsa.gov/webapi/api/Recalls/vehicle/year/2006/make/acura/model/MDX?format=json';

    var http = 'http://www.nhtsa.gov/webapi/api/Recalls/vehicle/year/'
    + _year + '/make/' + _make + '/model/' + _model + '?format=json';
    console.log('in GET RECALLS ' + http);

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
        S},
        error: function (xhr, error) {
            console.debug(xhr); console.debug(error);
            makesArray = NULL;
        }
    }).done(function (data) {
        // if (console && console.log) {
        console.log('Sample of data:' + data); //.slice(0, 100));

        // }
    });
}
