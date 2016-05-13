

function Submit() {

    var max_fields = 10; //maximum input boxes allowed
    var wrapper = $("#main_container"); //Fields wrapper
    var add_button = $(".add_field_button"); //Add button ID
    var submit = $(".btn-default");


    datefunction();
    var citiesdata = [];
    var fromDates = [];
    var toDates = [];
    var userData = [];
    var loc=[];

    var fromVal=false;
    var toVal=false;
    var cityval=false;


    $(".cities").each(function (e) {

        var city = $(this).val();
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': city}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                //resultsMap.setCenter(results[0].geometry.location);
                loc[0] = results[0].geometry.location.lat();
                loc[1] = results[0].geometry.location.lng();

                var temp1 = city + "X" + loc[0] + "Y" + loc[1];
                citiesdata.push(temp1);
                console.log(citiesdata);


            }

            generateJson();

        })


     


    })


    $(".fromDate").each(function (e) {

        fromDates.push($(this).val());
        console.log(fromDates);

    })


    $(".toDate").each(function (e) {

        toDates.push($(this).val());
        console.log(toDates);
    })




    function generateJson()
{

    for (var i = 0; i < citiesdata.length; i++) {
        var str = citiesdata[i];
        var index1 = str.indexOf('X');
        var index2 = str.indexOf('Y');
        var city = str.substr(0, index1);

        var latitude = str.substr(index1 + 1, index2);
        var indexY=latitude.indexOf('Y');
        var lat=Number(latitude.substr(0,indexY));

        var long = Number(str.substr(index2+1, str.length));



        var startdatetime = String(fromDates[i]);
        var fromIndex = startdatetime.indexOf(' ');
        startdatetime = startdatetime.substr(0, fromIndex) + "T" + startdatetime.substr(fromIndex + 1, startdatetime.length);
        var enddatetime = String(toDates[i]);
        var toIndex = enddatetime.indexOf(' ');
        enddatetime = enddatetime.substr(0, toIndex) + "T" + enddatetime.substr(toIndex + 1, enddatetime.length);
        var indCity = {
            "cityname": city,
            "latitude": lat,
            "longitude": long,
            "startdatetime": startdatetime,
            "enddatetime": enddatetime
        }
        userData.push(indCity);
        console.log(userData);

        saveuserchoices(userData);





    }


}

}

function saveuserchoices(userDataNew)
{
    console.log("printing User preferences",userDataNew)
    $.ajax
    ({
        dataType: 'json',
        data:JSON.stringify(userDataNew),
        type: 'POST',
        url: "/userSelection",
        success: function (data) {
            returned_data = data;
            //for (var m = 0; m < data.length; m++) {
            //delete data[m]._id;
            //}
            // var userData = data[0].userSelection;
            // console.log(userData);
            if (data.status==200)
            {
                window.location.assign("/displaySearchedGlobe")
            }
        }


    })
}

$(document).ready(function() {
    var max_fields      = 10; //maximum input boxes allowed
    var wrapper         = $(".input_fields_wrap"); //Fields wrapper
    var add_button      = $(".add_field_button"); //Add button ID
    datefunction();


        for (var j=0;j<cities.length;j++)
        {
            var name= cities[j].city
            var options = $("#options");
            options.append($("<option />").val(name).text(name));

        }



    var x = 1; //initlal text box count
    $(add_button).click(function(e){ //on add input button click
        e.preventDefault();
        if(x < max_fields){ //max input box allowed
            x++; //text box increment
            var main_div = document.getElementById("main_container").innerHTML;
            $(wrapper).append('<div>'+main_div+'<a href="#" class="btn remove_field">Remove</a></div>');
            //add input box
    datefunction();

        }

    });

	  $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
        e.preventDefault(); $(this).parent('div').remove(); x--;
    })
});

function datefunction() {
    $('.date').datetimepicker({
        locale: 'es',
        format: 'yyyy-MM-dd hh:mm:ss'
    });
    $('.date').datetimepicker({
        locale: 'es',
        format: 'yyyy-MM-dd hh:mm:ss'

    });


}





