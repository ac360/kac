
// Module dependencies
	var express 			= require('express');
	var http 				= require('http');
	var path 				= require('path');
	var db 					= require('./config/dbschema')
	var pass 				= require('./config/pass')
	var passport 			= require("passport");
	var LocalStrategy 		= require('passport-local').Strategy;
	var FacebookStrategy 	= require('passport-facebook').Strategy;
	var app 				= express();

// All environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);

// Denote Public Content
	app.use(express.static(path.join(__dirname, 'public')));

// Development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	}

// Routes
	// Define Controllers
		var landingpage    =    require('./controllers/landing_pages/landing_pages_controller');
		var userpage  	   =    require('./controllers/user_pages/user_pages_controller');
		var api            =    require('./controllers/api/api_controller');
		//var adminpage    =    require('./controllers/admin/admin_pages_controller');
	// Landing Page Routes
		app.get('/',  	                  landingpage.index);
		app.post('/', 	                  landingpage.signup);
		app.get('/login',                 landingpage.getlogin);
		app.post('/login',      	      landingpage.postlogin);
	// User Page Routes
		app.get('/dashboard',             					   pass.ensureAuthenticated, userpage.dashboard);
		app.get('/dashboard/import',      					   pass.ensureAuthenticated, userpage.dashboard);
	    app.get('/dashboard/import/google',                    pass.ensureAuthenticated, userpage.dashboard);
	// API Routes
		app.get('/api/current_user',      pass.ensureAuthenticated, api.currentuser)
		app.get('/api/googlecontacts',    pass.ensureAuthenticated, api.import_and_save_google_contacts)
		app.get('/logout',            	  userpage.logout);
	// Authentication Routes
		app.get('/auth/google/callback',  userpage.google_auth);
	// Admin Page Routes
		// app.get('/admin',  	    adminpage.index);

// Create Server
	http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});

// Exports the express app for other modules to use
	exports.app = app;
