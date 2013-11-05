var passport    	= require('passport');
var googleauth 		= require('../../config/auth_google');
var mongoose		= require('mongoose');
var User        	= mongoose.model('User');

exports.dashboard = function(req, res){
	res.render('dashboard', { 
	  	userId: req.user.id, 
	  	googleurl: googleauth.google_auth_link 
	});
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

// Google Import Controllers
	// Authenticate User's Google Account
	exports.google_auth = function(req, res){
	  	googleauth.google_auth_client.getToken(req.query.code, function(err, tokens) {
	  		if (tokens.refresh_token !== undefined) {
	  			User.findById(req.user.id, function (err, user) {
			    	if (err)  { console.log(err) }
			    	if (user) { 
			    		user.google_access_token  = tokens.access_token
			    		user.google_refresh_token = tokens.refresh_token
			    		user.google_auth = true
			    		user.save(function (err, user) {
		                	if (err) {
		                		console.log(err)
		                	} else {
		                		res.redirect('/dashboard/import/google');
		                	}
		          		}); // User.save
			    	} // if err
			    }); // User.findById
	  		} else {
	  			res.send(500,'Error: Refresh Token is not available.  Go into your Google account, revoke access for Keep-A-Contact, and try again.')
	  		};
		}); // googleauth
	}; // exports.google_auth