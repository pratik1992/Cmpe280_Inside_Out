/**
 * Created by pratikkulkarni on 5/1/16.
 */



/**
 * Created by pratikkulkarni on 4/19/16.
 */



/*$("button").click(function () {

 var location1 =$('#location1').val();
 var location2=$('#location2').val();
 var geocoder = new google.maps.Geocoder();


 })*/






function callGlobe(lat,long,length,airqualityindices) {
    var latitude=lat;
    var longitude=long;
    var length=length;
    var airqualityindices=airqualityindices;

    var  plotdata="[[ \"1990\",[";
    var end="]]]";

    $.ajax
    ({
        dataType: 'json',
        type: 'GET',
        url: "./findArea?latitude="+latitude+"&longitude="+longitude+"&length="+length+"&indices"+airqualityindices,
        success: function (data) {
            var returned_data = data;
            console.log(typeof returned_data);
            for (key in returned_data) {
                var latlng = Object.keys(returned_data[key]);
                var latitude = returned_data[key][latlng[0]];
                var longitude = returned_data[key][latlng[1]];
                var magnitude = String(Math.random());
                var start = "" + latitude + "," + longitude + "," + magnitude + ",";
                plotdata = plotdata.concat(start);

            }
            plotdata = plotdata.substring(0, plotdata.length - 1)
            plotdata = plotdata.concat(end);
            console.log(JSON.parse(plotdata));
            showGlobe(plotdata);


        }
    });



}

function breezoApi(latitude,longitude)
{

    console.log(latitude,longitude)
    console.log(typeof latitude)
    var newlongitude=-73.9977264;
    console.log(typeof newlongitude);
    var newlatitude=40.7324296;



    var jqxhr = $.get( "https://api.breezometer.com/baqi/?start_datetime=2015-10-25T00:00:00" +
            "&end_datetime=2015-10-26T12:00:00&interval=1" +
            "&lat="+latitude +
            "&lon="+longitude +
            "&fields=breezometer_aqi" +
            "&key=e90f1d04bc6c4d41ab2b84ecc19ad298",
        function() {
            return
        })
        .done(function(data) {
            var length=(data.length);
            var airqualityindices=[];
            console.log(data)

            for(var k=0;k<data.length;k++)
            {
                airqualityindices.push(data[k].breezometer_aqi);
            }
            console.log("Printing indices",airqualityindices);

            callGlobe(latitude,longitude,length,airqualityindices);
        })
}



$( document ).ready(function() {


    var latitude;
    var longitude;


    $.ajax
    ({
        dataType: 'json',
        type: 'GET',
        url: "/analysis",
        success: function (data) {

            for (var m = 0; m < data.length; m++) {
                delete data[m]._id;
            }
             var userData = data[0].userSelection;

            var finaldata=JSON.parse(userData);

            console.log(finaldata);



            latitude = finaldata.latitude
            longitude = finaldata.longitude;
            console.log(latitude);
            breezoApi(41.8781136, -87.62979819999998);


        }
    })

})




function showGlobe(plotdata) {
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
    }

    else {

        var years = ['1990', '1995', '2000'];
        var container = document.getElementById('container');
        var options = { zoom: 7.0 };
        var globe = new DAT.Globe(container,options);

        console.log(globe);
        var i, tweens = [];

        var settime = function (globe, t) {
            return function () {
                new TWEEN.Tween(globe).to({time: t / years.length}, 500).easing(TWEEN.Easing.Cubic.EaseOut).start();
                //var y = document.getElementById('year' + years[t]);
                //if (y.getAttribute('class') === 'year active') {
                  //  return;
                //}
                //var yy = document.getElementsByClassName('year');
                //for (i = 0; i < yy.length; i++) {
                   // yy[i].setAttribute('class', 'year');
                //}
                //y.setAttribute('class', 'year active');
            };
        };

        for (var i = 0; i < years.length; i++) {
            var y = document.getElementById('year' + years[i]);
            y.addEventListener('mouseover', settime(globe, i), false);
        }

        var xhr;
        TWEEN.start();


        var data = JSON.parse(plotdata);
        console.log(data);
        window.data = data;
        for (i = 0; i < data.length; i++) {
            globe.addData(data[i][1], {format: 'magnitude', name: data[i][0], animated: true});
        }
        globe.createPoints();
        settime(globe, 0)();
        globe.animate();
        document.body.style.backgroundImage = 'none'; // remove loading


    }
}


