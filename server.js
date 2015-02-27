// set up ======================================================================
//var express  = require('express');
var express = require('express');
var app = express();
				 		// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port  	 = process.env.PORT || 3000; 				// set the port
var database = require('./config/database'); 			// load the database config
var passwordHash = require('password-hash');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
//******new***
var passport = require('passport');
 
//*************
var morgan = require('morgan'); 		// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

//var MongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');
var router = express.Router();

var server = require('http').createServer(app).listen(port);
var io = require('socket.io').listen(server);
 
var nicknames = []; 
//var server = require('http').Server(app);
//var io = require('socket.io')(server);	
 
// configuration ===============================================================
mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io
require('./config/passport')(passport);
app.use(express.static(__dirname + '/views')); 				// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// using cnonect-session  cookies parser
app.use(session({ secret: 'setthesessionkey' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); 
app.set('view engine', 'ejs');

router.use(function(req, res, next) {

	// log each request to the console
	console.log(req.method, req.url);

	// continue doing what we were doing and go to the route
	next();	
});

router.get('/about',function(req,res){
	res.send('about');
});

app.use('/about',router);




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
require('./app/routes.js')(app,passport);

// listen (start app with node server.js) ======================================
//app.listen(port);
console.log("App listening on port " + port);




app.get('/chat',function(req,res){
	res.sendfile(__dirname + '/public/meeting.html');
});


io.sockets.on('connection',function(socket){
	console.log("received connection");

   socket.on('new_user',function(data, callback){
		if(nicknames.indexOf(data) != -1){
			callback(false);
		}else{
			callback(true);
			socket.nickname = data;
			console.log(socket.nickname);
			nicknames.push(socket.nickname);
			io.sockets.emit('usernames', nicknames);
		}

	});
		 

	socket.on('send_message',function(data){
		console.log("received send_message");
        io.sockets.emit('new_message',{"user": socket.nickname, "data":data});

	});

	socket.on('disconnect',function(data){
		if(!socket.nickname) return;

		nicknames.splice(nicknames.indexOf(socket.nickname),1);
        io.sockets.emit('usernames', nicknames);
     
	});

	
});


