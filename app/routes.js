var Logininfo = require('./models/logininfo');
var Project = require('./models/project');
var It = require('./models/it');

var sess;
var currentDate = Date();


module.exports = function(app) {



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

	/*
	app.get('*', function(req, res) {
			sess=req.session;
			
				res.sendfile('./public/index.html'); 
			
	
	});
	*/
		app.get('/awesome', function(req, res) {
		  if(req.session.lastPage) {
		    res.write('Last page was: ' + req.session.lastPage + '. ');
		  }

		  req.session.lastPage = '/awesome';
		  res.send('Your Awesome.');
		  return res.redirect('/radical');
		});

		app.get('/radical', function(req, res) {
		  if(req.session.lastPage) {
		    res.write('Last page was: ' + req.session.lastPage + '. ');
		  }

		  req.session.lastPage = '/radical';
		  res.send('What a radical visit!');
		});

		app.get('/tubular', function(req, res) {
		  if(req.session.lastPage) {
		    res.write('Last page was: ' + req.session.lastPage + '. ');
		  }

		  req.session.lastPage = '/tubular';
		  res.send('Are you a surfer?');
});




};



