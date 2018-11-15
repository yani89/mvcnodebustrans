var express = require('express');

var app = express();
var multer = require('multer')
var constants = require('constants');
var constant = require('./config/constants');
const http = require('http');
var curl = require('curlrequest');

var port = process.env.PORT || 4333;
var mongoose = require('mongoose');
var mongodb  = require('mongodb');
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
const socketIO = require('socket.io');
var now = new Date();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


/***************Mongodb configuratrion********************/
var mongoose = require('mongoose');
var configDB = require('./config/database.js');
//configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
var db = mongoose.connection;

require('./config/passport')(passport); // pass passport for configuration

const server = http.Server(app);
var io = socketIO(server);
global.io = io; 


//-- curl options
var options = {
    url: 'http://crop.jakarta.go.id/ajax/apps_get_tj.php'
  , verbose: true
  , stderr: true,
  retries : 3
};
var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'dbapps2';
// save data into db
function sendTime(routeLatLong) {
	var lat = null;
	var lng = null;
	var buscode = null;
	var current_tripid = null;
	var trip_name = null; 
	var gpsdatetime = null; 
	var location = null; 
	var koridor = null; 
	var longitude = null; 
	var latitude = null; 
	var speed = null; 
	var course = null; 
	var color = null; 
	var voiceno = null; 
	var tanggal = null;
	
	curl.request(options, function (err, data) {
		//console.log(data);
		//var string = JSON.stringify(data);
		var objectData = JSON.parse(data);
		//console.log(objectData['buswaytracking'].length);
		var total = objectData['buswaytracking'].length;
		console.log(total);

			MongoClient.connect(url,function(err,client){	
				if(err){
					console.log('Unabel to connect to mongo server ERROR : ' ,err);
				}else {		
					for(var i=0; i< total; i++){
						lat = objectData['buswaytracking'][i]['longitude'];
						lng = objectData['buswaytracking'][i]['latitude'];
						buscode = objectData['buswaytracking'][i]['buscode'];
						current_tripid = objectData['buswaytracking'][i]['current_tripid'];
						trip_name = objectData['buswaytracking'][i]['trip_name'];
						gpsdatetime = objectData['buswaytracking'][i]['gpsdatetme'];
						location = objectData['buswaytracking'][i]['location'];
						koridor = objectData['buswaytracking'][i]['koridor'];
						speed = objectData['buswaytracking'][i]['speed'];
						course = objectData['buswaytracking'][i]['course'];
						color = objectData['buswaytracking'][i]['color'];
						voiceno = objectData['buswaytracking'][i]['voiceno'];
						

						const db = client.db(dbName);
						var collection = db.collection('bustransX');
						var c = {
							lat: lat,
							lng: lng,
							buscode:buscode,
							current_tripid:current_tripid,
							trip_name:trip_name,
							gpsdatetime:gpsdatetime,
							location:location,
							koridor:koridor,
							speed:speed,
							course:course,
							color:color,
							tanggal: new Date(Date.now())
						};	
						collection.insert(c);	
						//console.log("Date ", c);		
					}
						
						
				}
			});			
		
	});	
 
}

setInterval(sendTime, 60000);
//--- end 

//set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

//view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');
//app.set('view engine', 'ejs'); // set up ejs for templating


//required for passport
//app.use(session({ secret: 'iloveyoudear...' })); // session secret

app.use(session({
    secret: 'I Love India...',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./config/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


//launch ======================================================================
//app.listen(port);
//console.log('The magic happens on port ' + port);

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).render('404', {title: "Sorry, page not found", session: req.sessionbo});
});

app.use(function (req, res, next) {
    res.status(500).render('404', {title: "Sorry, page not found"});
});
server.listen(port, () => {
	console.log('Server is running at port: ' + port);
});

exports = module.exports = app;