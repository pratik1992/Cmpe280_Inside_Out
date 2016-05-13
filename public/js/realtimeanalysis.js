/**
 * Created by pratikkulkarni on 5/5/16.
 */



$(document).ready(function () {


var jsondata

    $.ajax
        ({
            dataType: 'jsonp',
            type: 'GET',
            url: "http://www.freetimeworks.com/cmpe280/?action=best_cities",
            jsonp:'jsoncallback',


            success: function (data)
            {
                console.log("hihi");


               $.ajax
                ({
                    dataType: 'json',
                    type: 'POST',
                    url: "/saverealtimedata",
                    data:data,
                    success: function (returnData)
                    {

                      console.log("Saved",returnData);

                    }
                });

                console.log(data);



            },
            error:function(err)
            {
              console.log("ERR",err);
            },

            complete:function(cm,status)
            {
                console.log(cm,status)
            }
            })


  /*  var jqxhr = $.get("http://www.freetimeworks.com/cmpe280/?action=best_cities",

        function () {
            return
        }).done(function (testdata) {
        console.log(testdata)

    })*/





})






