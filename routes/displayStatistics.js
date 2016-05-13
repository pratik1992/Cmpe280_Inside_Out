/**
 * Created by pratikkulkarni on 5/2/16.
 */

var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/airpidb";
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;

var data=[];

exports.sendAnalysis=function(req,res) {


    findUserChoice(function () {
        console.log("Hi again",data);
        res.writeHead(200, {'content-type': 'text/json'});
        res.write(JSON.stringify(data));
        res.end('\n');

    })

}



function findUserChoice(callback)
{

    MongoClient.connect(mongoURL, function(err, db) {
        
        findSelection(db, function() {
            db.close();
            callback();

        });
    });

}



var findSelection = function(db, callback) {



   var cursor= db.collection('userChoices').find().sort({$natural:-1}).limit(1);

    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            data.push(doc);
            console.dir("Hi",data);
        } else
        {
            callback();
        }
    });
};



exports.test = function(req,res){



    /*MongoClient.connect(mongoURL, function(err, db)
    {
        var newdata=[];
        db.collection('userChoices').find().sort({$natural:-1}).limit(1).toArray(function(err, doc){
            if(err){

            } else {
                console.log(doc);
                newdata.push(doc);
                var  test=JSON.stringify(doc);
                console.log("test"+test);
                console.log(test._id);
                res.send({inputData: newdata});
            }
        });

        /!*console.log("Test ravi")

        cursor.each(function(err, doc) {
            assert.equal(err, null);
            if (doc != null) {

            }
        });*!/
    });
*/





   var newdata=[
        {
            "cityname":"San Fransisco",
            "latitude":40.7324296,
            "longitude":-73.9977264,
            "startdatetime":"2016-05-8T00:00:00",
            "enddatetime":"2016-05-11T12:00:00"

        },


        {
            "cityname":"San Jose",
            "latitude":40.7324296,
            "longitude":-73.9977264,
            "startdatetime":"2016-05-8T00:00:00",
            "enddatetime":"2016-05-11T12:00:00"

        }
    ];
    res.send({inputData: newdata});
    //var searchResult = [];



};
