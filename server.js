// set up ======================================================================
var express  = require('express');
						// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port  	 = process.env.PORT || 3000; 				// set the port
var database = require('./config/database'); 			// load the database config
var passwordHash = require('password-hash');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var morgan = require('morgan'); 		// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

//var MongoStore = require('connect-mongo')(express);
 
var app      = express(); 		
// configuration ===============================================================
mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io
 
app.use(express.static(__dirname + '/public')); 				// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// using cnonect-session  cookies parser
app.use(session({secret: 'sshhhhh'}));
//app.use(express.cookieParser());







app.configure = function configure(nconf,next){
	next(null);
};
app.requestStart = function requestStart(server){
	server.use(flash());
};
app.requestBeforeRoute = function requestBeforeRoute(server){
	server.use(express.methodOverride());
};

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
