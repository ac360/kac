var passport    	= require('passport');
var mongoose		= require('mongoose');
var util            = require('util');
var googleauth 		= require('../../config/auth_google');
var GoogleContacts  = require('../../config/contacts_google_2').GoogleContacts;
var Contact         = mongoose.model('Contact')
var _               = require('underscore');

exports.currentuser = function(req, res){
	  var user 					 = {}
	  var userData 				 = req.user
	  user.id      				 = userData.id
	  user.email   				 = userData.email
	  user.google_auth  		 = userData.google_auth
	  user.google_import		 = userData.google_import
	  user.facebook_auth		 = userData.facebook_auth
	  user.facebook_import		 = userData.facebook_import
	  user.linkedin_auth    	 = userData.linkedin_auth
	  user.linkedin_import  	 = userData.linkedin_import
	  user.google_auth_link 	 = googleauth.google_auth_link 
	  user.google_access_token   = userData.google_access_token
	  user.google_refresh_token  = userData.google_refresh_token
	  res.send(user);
};

exports.contacts_all = function(req, res){
	console.log("Now Fetching User's Contacts...")
	Contact.find({ owner: req.user}, function (err, users) {
		if (err) { console.log(err) };
	  	console.log(users.length + " Users Fetched...");
	  	var sortedUsers = _(users).sortBy("title");
	  	res.send(sortedUsers);
	});
};

exports.contacts_create = function(req, res) {
	var contacts = req.body;
	var count = 1;
	var importedCount = 1;
	var unimportedCount = 0;
	for (var property in contacts) { // Loop through every property
	   if( !isNaN(property) ) {      // Only do stuff if the property is a number
	       contact = contacts[property];
	       // Check if Google Contact
	       if (contact.ids.google) {
		   		var newContact  = new Contact(contact);
		        newContact.owner = req.user.id
		        newContact.save(function(err) {
		           // Duplicate Contacts will not be saved due to Mongo uniquness validation on ids property
			       if (err) {
			       		if (err.code === 11000) {  
				       		console.log("User already exists"); 
				       		unimportedCount = unimportedCount + 1;
				        } else {
				       		console.log(err); 
				        };
			       };
			       count = count + 1;
			       if (count >= Object.keys(contacts).length) {
			       		res.send(200, { imported: Object.keys(contacts).length - unimportedCount, unimported: unimportedCount });
			       }
			    }); // .save
	       } // if google contact
	       if (contact.ids.facebook) {
	       } // if facebook contact
	       if (contact.ids.linkedin) {
	       }; // if linkedin contact
	   }; // if !isNAN
	}; // for
}; // contacts_create

