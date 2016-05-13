/**
 * Created by pratikkulkarni on 5/2/16.
 */

var returned_data

var finalData=[];




$( document ).ready(function(){

    $.ajax
    ({
        dataType: 'json',
        type: 'GET',
        url: "/analysis",
        success: function (data)
        {
            returned_data = data;
            for (var m=0;m<data.length;m++)
            {
                delete data[m]._id;
            }
            var userData=data[0].userSelection;
            console.log(userData);



            nextIteration(0);

              function  nextIteration(i)
                {
                    if (i>=userData.length)
                    {
                        return
                    }

                    var latitude = userData[i].latitude;
                    var longitude = userData[i].longitude;
                    var cityname = userData[i].cityname;
                    var startdatetime=userData[i].startdatetime;
                    var enddatetime=userData[i].enddatetime;
                    var averageAqi=0;
                    var pollutantDescription;
                    var countryDescription;
                    var causes;
                    var effects;
                    var recommendation;



                    var jqxhr = $.get("https://api.breezometer.com/baqi/?start_datetime=" +startdatetime+
                        "&end_datetime="+enddatetime+"&interval=8" +
                        "&lat=" + latitude +
                        "&lon=" + longitude +
                        "&fields=breezometer_aqi" +
                        "&key=e90f1d04bc6c4d41ab2b84ecc19ad298",

                        function () {
                            return
                        }).done(function (testdata) {

                        console.log("After startdate")

                        for(var j=0;j<testdata.length;j++)
                        {
                             averageAqi=(averageAqi+testdata[j].breezometer_aqi);
                             pollutantDescription =(testdata[j].dominant_pollutant_description) ;
                             countryDescription=  (testdata[j].country_description);
                             causes= (testdata[j].dominant_pollutant_text.causes);
                             effects= (testdata[j].dominant_pollutant_text.effects);
                             recommendation=(testdata[j].random_recommendations.health);

                        }

                        averageAqi=(averageAqi/testdata.length);

                        var individualData={
                            cityname:cityname,
                            averageAqi: averageAqi,
                            pollutantDescription:pollutantDescription,
                            countryDescription:countryDescription,
                            causes:causes,
                            effects:effects,
                            recommendation:recommendation

                        }

                        finalData.push(individualData);
                        nextIteration(i+1);

                        console.log(finalData);





                    })
                }











        }
    });
})








