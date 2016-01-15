$(document).ready(function () {
    var http = 'http://www.nhtsa.gov/webapi/api/Recalls/vehicle/modelyear/2006/make/acura/model/MDX?format=json';
        
    $.ajax({
        url: http,
        dataType: 'jsonp',
        jsonpCallback: "callback",
        type: "GET",
        success: function (data) {
            var div = $('#data');
            for (var i = 0; i < data.Results.length; i++) {
                $(div).append('<div>' + data.Results[i].Component + " "+
                    +data.Results[i].ModelYear + " " +
                    + data.Results[i].Conequence + '</div>');
            }
        }
    }).done(function (data) {
       // if (console && console.log) {
        console.log("Sample of data:"+ data); //.slice(0, 100));
        
       // }
    });

    initializeYearSlider(1936, 2015, 1988);  // replace w/ API call for min & max

});

     function initializeYearSlider(yr_first,yr_last,yr_start) {


        $("#slider-vertical").slider({
            orientation: "vertical",
            range: "min",
            min: yr_first,
            max: yr_last,
            value: yr_start,
            slide: function (event, ui) {
                $("#amount").val(ui.value);  
            },
            stop: function( event,ui) {
                alert("finished sliding!!!");
            }
        });
        $("#amount").val($("#slider-vertical").slider("value"));

    };