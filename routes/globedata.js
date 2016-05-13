/**
 * Created by pratikkulkarni on 5/1/16.
 */


var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/airpidb";
var data=[];
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
 var  assert = require('assert');

exports.list = function(req, res){
    res.send("respond with a resource");
};



exports.redirectToHome = function(req, res){
    res.render("home", {user: req.session.user});
};

exports.getCoordinates = function(req, res) {

    retrieveDetails(function () {
        console.log(data);
        res.writeHead(200, {'content-type': 'text/json'});
        res.write(JSON.stringify(data));
        res.end('\n');

    }, req.query.latitude, req.query.longitude, req.query.length,req.query.indices)


}


//Logout the user - invalidate the session
exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/');
};


function retrieveDetails(callback,latitude,longitude,length,indices)
{

    MongoClient.connect(mongoURL, function(err, db) {
        assert.equal(null, err);
        findLatLng(db, function() {
            db.close();
            callback();

        },latitude,longitude,length,indices);
    });

}


var findLatLng = function(db, callback,latitude,longitude,length,indices) {
    console.log(latitude,longitude,length,indices);

    var lat=Number(latitude);
    var count=Number(latitude)+ Number(length);
    console.log(count);

    var cursor =db.collection('zipdata').find({ latitude:{$gte:lat ,$lt:count }},{latitude:1,longitude:1,_id:0} );
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            data.push(doc);
            //console.dir(data);
        } else
        {
            callback();
        }
    });
};



