/**
 * Created by pratikkulkarni on 5/2/16.
 */

var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/airpidb";
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var  assert = require('assert');


var db;
var connected = false;

var data=[];





exports.ObjectId = require('mongodb').ObjectID;




 exports.performAnalysis = function(req,res){



    var  userChoicesData=JSON.stringify(req.body);
     var test=JSON.parse(userChoicesData);
    var finaldata=Object.keys(test);
     var testdata=JSON.parse(finaldata);

     console.log("Final data"+testdata);



    //var cities=userChoicesData.userSelection.cities;ss


    //for (var i=0;i<userChoicesData.length;i++)

        //console.log(userChoicesData[i]);





    mongo.connect(mongoURL, function() {
        var json_responses;
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('userChoices');


            coll.insert({ "userSelection":userChoicesData},

            function(err1, user) {

                console.log("inserting");

                res.send({"status":200});


            });

    })



}


exports.showAnalysis=function(req,res){

    res.render("showAnalysis");
}


exports.showForm=function(req,res){


    res.render("form")


}






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




exports.startWebGL = function(req,res){

    res.render("displayGlobe");

}


exports.startSearchWebGL = function(req,res){

    res.render("displayGlobe");

}

exports.startWorldWebGL = function(req,res){

    res.render("displayWorldGlobe");

}



exports.index = function(req, res){
    if (req.session.user) {
        console.log('validated user');
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("home", { user : req.session.user });
    } else {
        res.render('index', { title: 'AirPI' });
    }

};





exports.connect = function(url, callback){
    MongoClient.connect(url, function(err, _db){
        if (err) { throw new Error('Could not connect: '+err); }
        db = _db;
        connected = true;
        console.log(connected +" is connected?");
        callback(db);
    });
};


exports.collection = function(name){
    if (!connected) {
        throw new Error('Must connect to Mongo before calling "collection"');
    }
    return db.collection(name);

};


exports.restrict = function(req, res, next)
{
    if (req.session.user) {
        console.log('validated user');
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
    } else {
        req.session.error = 'Access denied!';
        console.log('not validated user');
        res.redirect('/');
    }
};






/*exports.performAnalysis = function(req,res){



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

                res.send({"status":200});


            });

    })



}*/

exports.showAnalysis=function(req,res){

    res.render("showAnalysis");
}


exports.showForm=function(req,res){


    res.render("searchForm")


}




exports.list = function(req, res){
    res.send("respond with a resource");
};

//Check login - called when '/checklogin' POST call given from AngularJS module in login.ejs
exports.checkLogin = function(req, res) {
    if (req.session.user) {
        console.log('validated user');
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("home", { user : req.session.user });
    } else {
        var json_responses;
        var email = req.param("email");
        var pass = req.param("password");
        if (!module.parent)
            console.log('authenticating %s:%s', email, pass);

        mongo.connect(mongoURL, function(dbConn) {
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = dbConn.collection('users');
            coll.findOne({ email : email }, function(err1, user) {
                if (user) {
                    // This way subsequent requests will know the user is logged in.
                    if(user.password === pass){
                        console.log("returned true");
                        req.session.user = user;
                        json_responses = { "statusCode" : 200, user: user };
                        res.send(json_responses);
                    } else {
                        console.log("returned false");
                        json_responses = { "statusCode" : 401, "msg" : "Email/password invalid." };
                        res.send(json_responses);
                    }
                } else {
                    console.log("returned false");
                    json_responses = { "statusCode" : 401, "msg" : "User not found." };
                    res.send(json_responses);
                }
            });
        });
    }
};

exports.redirectToHome = function(req, res){
    res.render("home", {user: req.session.user});
};

exports.register = function(req, res){
    mongo.connect(mongoURL, function() {
        var json_responses;
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('users');
        coll.insert({ first_name : req.param('firstName'),
            last_name : req.param('lastName'),
            email : req.param('email'),
            password: req.param('pass'),
            city: req.param('city')}, function(err1, user) {
            // insert user into db
            console.log("inserting");
            if(err1){
                json_responses = { statusCode: 401, title: 'AirPI', alertClass: 'alert-danger', msg: 'Oops! An error occurred. Please try again.' };
                res.send(json_responses);
            }
            else
            {
                json_responses = { statusCode: 200, title: 'AirPI', alertClass: 'alert-success', msg: 'Successfully registered. Please Login..' };
                res.send(json_responses);
            }
        });
    });
};

//Logout the user - invalidate the session
exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/');
};


exports.viewStats = function(req, res) {
    res.render("viewStats");
};

exports.analytics = function(req, res) {
    res.render("analytics");
};

exports.analytic = function(req, res) {
    res.render("analytic");
};


exports.realtimeAnalysis = function(req, res) {
    res.render("realtimeAnalysis");
};

exports.worstCities=function(req,res)
{

    var  realtimeData=req.body;
  
 

    for (var i=0;i<realtimeData.length;i++)
    {
        console.log(realtimeData[i]);
    }




   /* mongo.connect(mongoURL, function() {
        var json_responses;
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('userChoices');


        coll.insert({ "userSelection":userChoicesData},

            function(err1, user) {

                console.log("inserting");

                res.render("displayGlobe");


            });

    })*/
    
    
}


exports.informationResult = function(req, res){
    res.render('informationResult');
};

exports.test = function(req,res){

    var data=[
        {
            "cityname":"San Fransisco",
            "latitude":40.7324296,
            "longitude":-73.9977264,
            "startdatetime":"2015-10-25T00:00:00",
            "enddatetime":"2015-10-26T12:00:00"

        },


        {
            "cityname":"San Jose",
            "latitude":40.7324296,
            "longitude":-73.9977264,
            "startdatetime":"2015-10-25T00:00:00",
            "enddatetime":"2015-10-26T12:00:00"

        },


        {
            "cityname":"Santa Clara",
            "latitude":40.7324296,
            "longitude":-73.9977264,
            "startdatetime":"2015-10-25T00:00:00",
            "enddatetime":"2015-10-26T12:00:00"

        },

        {
            "cityname":"Santa Cruz",
            "latitude":40.7324296,
            "longitude":-73.9977264,
            "startdatetime":"2015-10-25T00:00:00",
            "enddatetime":"2015-10-26T12:00:00"

        },
    ];

    //var searchResult = [];


    res.send({inputData: data});
};

exports.healthByCity = function(req, res){
    res.render('healthByCity');
};











