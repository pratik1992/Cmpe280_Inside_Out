/**
 * Created by pratikkulkarni on 5/2/16.
 */

var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/airpidb";


exports.performAnalysis = function(req,res){



    var  userChoicesData=req.body;
    console.log( "Hi",userChoicesData);
    //var cities=userChoicesData.userSelection.cities;

    for (var i=0;i<userChoicesData.length;i++)
    {
        console.log(userChoicesData[i]);
    }




     mongo.connect(mongoURL, function() {
         var json_responses;
         console.log('Connected to mongo at: ' + mongoURL);
         var coll = mongo.collection('userChoices');


         coll.insert({ "userSelection":userChoicesData},

              function(err1, user) {

             console.log("inserting");

                  res.render("showAnalysis");


              });

     })



}

exports.showAnalysis=function(req,res){

    res.render("showAnalysis");
}


exports.showForm=function(req,res){
    
    
    res.render("form")
    

}




