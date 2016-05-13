
/**
 * Module dependencies.
 */



var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	,globedata=require('./routes/globedata'),
	graphicsGlobe=require('./routes/graphicsGlobe')
twodimesionStatistics=require('./routes/twodimensionStatistics')


	,http = require('http')
	,displayStatistics=require('./routes/displayStatistics')
	,path = require('path')
	,sessionMgmt = require('./routes/sessionMgmt'),
	stylus = require('stylus'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	MongoClient = require('mongodb').MongoClient,
	ObjectId = require('mongodb').ObjectID,
	assert = require('assert');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var routeDetails=require('./routes/routeDetails');





var mongoSessionConnectURL = "mongodb://localhost:27017/airpidb";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");

var app = express();

app.use(logger('dev'));
app.use(bodyParser());
app.use(expressSession({
	secret: 'cmpe280_teststring',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));


app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

//GET
app.get('/', routeDetails.index);
app.get('/logout', routeDetails.logout);
app.get('/home', sessionMgmt.restrict, routeDetails.redirectToHome);
app.get('/findArea', routeDetails.getCoordinates);
app.get('/displayGlobe',routeDetails.startWebGL);
app.get('/displaySearchedGlobe',routeDetails.startSearchWebGL);
app.get('/displayWorldGlobe',routeDetails.startWorldWebGL);
app.get('/analytic',routeDetails.analytic);
app.get('/analysis',displayStatistics.sendAnalysis);
app.get('/chooseCity',routeDetails.showForm);
app.get('/showAnalysis',routeDetails.showAnalysis);
app.get('/analytics',routeDetails.analytics);
app.post('/userSelection',routeDetails.performAnalysis);
app.get('/viewStats',routeDetails.viewStats);
app.get('/realtimeAnalysis',routeDetails.realtimeAnalysis);
app.get('/healthByCity', routeDetails.healthByCity);
app.get('/generalInfo', user.generalInfo);
//app.post('/saverealtimedata',routeDetails.worstCities);


app.get('/informationResult', sessionMgmt.restrict, routeDetails.informationResult);
app.post('/getResult', displayStatistics.test);





app.post('/checkLogin', routeDetails.checkLogin);
app.post('/register', routeDetails.register);





mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});
});
