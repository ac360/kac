var passport    	= require('passport');
var mongoose		= require('mongoose');
var util            = require('util');
var googleauth 		= require('../../config/auth_google');
var GoogleContacts  = require('../../config/contacts_google_2').GoogleContacts;

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

// Fetch Google Contacts
exports.import_and_save_google_contacts = function(req, res) {
	var user = req.user
    
	var c = new GoogleContacts({
	    token: user.google_access_token
	});
	c.on('error', function (e) {
	    console.log('error', e);
	});
	c.on('contactsReceived', function (contacts) {
	    // console.log('contacts: ', util.inspect(contacts, {depth:null}));
	    var formattedContacts = [];
		contacts.feed.entry.forEach(function (entry) {
		    try {
		      var name = entry.title['$t'];
		      var email = entry['gd$email'];// only save first email
		      var phone = entry['gd$phoneNumber']; // This is an array, we need to save all of them
		      var organization = entry['gd$organization']; // Also an array
		      var address = entry['gd$structuredPostalAddress'];

		      formattedContacts.push({ name: name, email: email });
		    }
		    catch (e) {
		      // property not available...
		    }
	    });
	    console.log(formattedContacts);
	});
	// c.on('contactGroupsReceived', function (contactGroups) {
	//     console.log('groups: ', util.inspect(contactGroups, {depth:null}));
	// });
	c.getContacts({
	    projection: 'thin',
	    'max-results': 1000
	});
}; // exports.google_fetch_contacts