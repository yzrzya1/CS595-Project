
var Project = require('./models/project');
var It = require('./models/it');
var Contact = require('./models/contact');
var Todo = require('./models/todo');
//var contact = new Contact();
 
var currentDate = Date();
//****************using Passport********************

module.exports = function(app,passport) {

app.get('/login',
	function(req,res){ 
		res.render('login.ejs');
	}
	);

app.get('/',isLoggedIn,
	function(req,res){
		console.log(req.user);
		res.render('index.ejs', {
			user : req.user
		});

		console.log("current session is :" +req.session.uname);
	});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/login');
	req.session = null ;
	console.log(req.session);
});

app.get('/loginlocal',
	function(req,res){
		console.log('login load');
		res.render('loginlocal.ejs', { message: req.flash('loginMessage') });
	}
	);

app.post('/loginlocal',passport.authenticate('local-login', {
			successRedirect : '/', // redirect to the secure profile section
			failureRedirect : '/loginlocal', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		})
	
	,function(req,res){
		console.log(req.body.email);
		req.session.uname =req.body.email;
		console.log(req.body);
		console.log(req.session);

		console.log("post Login");
		res.redirect('/');
	}
	  
	);

app.get('/signup',
	function(req,res){
		console.log('signup load');
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	}
	);

app.post('/signup', passport.authenticate('local-signup', {
	successRedirect : '/', // redirect to the secure profile section
	failureRedirect : '/signup', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

app.get('/unlink/local', isLoggedIn, function(req, res) {
	var user            = req.user;
	user.local.email    = undefined;
	user.local.password = undefined;
	user.save(function(err) {
		res.redirect('/');
	});
});
app.get('/connect/local', function(req, res) {
	res.render('connect-local.ejs', { message: req.flash('loginMessage') });
});
app.post('/connect/local', passport.authenticate('local-signup', {
	successRedirect : '/', // redirect to the secure profile section
	failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

//***************************end ****************
	app.get('/api/projects', function(req, res) {
		Project.find(function(err, projects) {
			if (err) 
				res.send(err)
			res.json(projects); 
		});
	});

	app.get('/api/its', function(req, res) {
		It.find(function(err, its) {
			if (err)
				res.send(err)
			res.json(its);    
		}).limit(3);
	});

 
	app.get('/api/contacts', function(req, res) {
		Contact.find(function(err, contacts) {
			if (err)
				res.send(err);
			res.json(contacts); 
		});
	});
	app.get('/api/contacts/:contact_id',function(req, res){
		Contact.findById(req.params.contact_id,function(err, contact){
			if(err)
				res.send(err);
			res.json(contact);
		});
	});

	app.post('/api/contacts', function(req, res) {
		
		
		var contact_data = {
								admin:[
									{	firstName: 	req.body.firstName,
										lastName: 	req.body.lastName,
									 	Email: 		req.body.Email,
									 	phoneNumber: [{type:'private', 	number:  	req.body.phoneNumberprivate},
									 				  {type:'public', 	number: 	req.body.phoneNumberpublic}
									 				 ]
									}]
							};
		var contact = new Contact(contact_data);

		contact.save(function(err,contacts) {
			if (err)
				res.send(err);
			res.json(contacts);
			
		});
		
	});

	app.delete('/api/contacts/:contact_id', function(req, res) {
		Contact.remove({
			_id : req.params.contact_id
		}, function(err, contact) {
			if (err)
				res.send(err);

			
			Contact.find(function(err, contact) {
				if (err)
					res.send(err)
				res.json(contact);
			});
		});
	});

//******************** daily task***************

	app.get('/api/todos', function(req, res) {
		getTodos(res);
	});

	app.post('/api/todos', function(req, res) {
		Todo.create({
			text : req.body.text,
			checked : false
		}, function(err, todo) {
			if (err)
				res.send(err);
			getTodos(res);
		});

	});

	app.put('/api/todos/:todo_id', function(req, res) {
		Todo.findById(req.params.todo_id, function(err, todo){
			if (err)
				res.send(err);
			todo.checked=!req.body.checked;
			todo.save(function(err){
				if(err)
					res.send(err);
				getTodos(res);
			});
		});
	});

	app.delete('/api/todos/:todo_id', function(req, res) {
		Todo.remove({
			_id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			getTodos(res);
		});
	});

//****************************************
	app.get('/api/logininfos:logininfos',function(req,res){
		req.session.name = req.params.logininfos;

		res.send('<p> Session Set: <a href="/logininfos">View Here</a>');
	});

	app.get('/api/login/logininfos',function(req,res){
			if(req.session.uname){
			var data = '/dashboard';
			
			res.end(data);
			console.log(req.session.uname);
			}

		
	});

	app.get('/api/logininfos', function(req, res) {

		Logininfo.find(function(err, logininfos) {

			
			if (err)
				res.send(err)

			res.json(logininfos); 
		});
	});

	//it is the login auth  					********** problem with auth
	app.post('/api/login/logininfos', function(req, res) {
		var logininfo = new Logininfo();
		logininfo.uname = req.body.uname;
		logininfo.upsd = req.body.upsd;
		
		console.log(logininfo);
		 Logininfo.find({
				"uname" : logininfo.uname,
				"upsd" : logininfo.upsd
		}, function(err, logininfo) {
			if (err){
				res.send(err);
				res.render('');
			}

				req.session.uname=logininfo.uname;

				var data = '/#/dashboard';
			
				res.end(data);
				console.log(req.session.uname);
				
		});
	});
	//it is the register 
	app.post('/api/register/logininfos', function(req, res) {
			console.log('post works');
		var logininfo = new Logininfo();
		logininfo.uname = req.body.uname;
		logininfo.upsd = req.body.upsd;
		logininfo.urole = req.body.urole;
		console.log(logininfo.uname);

		Logininfo.create({
		uname : req.body.uname,
		upsd : req.body.upsd,
		urole : req.body.urole
		}, function(err, logininfo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Logininfo.find(function(err, logininfos) {
				if (err)
					res.send(err)
				res.json(logininfos);
			});
		});
	
		//console.log(flashUname);
		
	});
	
	app.post('/api/logininfos/:logininfo_id', function(req, res) {
		console.log(req.params.logininfo_id);
		Logininfo.update(
			{"_id" : req.params.logininfo_id},
			{$set:{"done" : true}}
		, function(err, logininfo) {
			if (err)
				res.send(err);

			
			Logininfo.find(function(err, logininfos) {
				if (err)
					res.send(err)
				res.json(logininfos);
			});
		});
	});
	
	
	app.delete('/api/logininfos/:logininfo_id', function(req, res) {
		Logininfo.remove({
			_id : req.params.logininfo_id
		}, function(err, logininfo) {
			if (err)
				res.send(err);

			
			Logininfo.find(function(err, logininfos) {
				if (err)
					res.send(err)
				res.json(logininfos);
			});
		});
	});

};


function getTodos(res){
	Todo.find(function(err, todos) {
			if (err)
				res.send(err)
			res.json(todos); 
		});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}