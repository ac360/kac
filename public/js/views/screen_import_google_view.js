KAC.Views.ScreenImportGoogle = Backbone.View.extend({
	
	tagName: "div",
    id: "screen-import-google",
    className: "",

	initialize: function() {
	},

	events: {

	},

	fetchGoogleAndUserContacts: function() {
		var self = this;
		console.log("Now fetching Google Contacts...");
		// Fetch Contacts From Google
		$.ajax({
		  url: 'https://www.google.com/m8/feeds/contacts/default/full',
		  dataType: 'jsonp',
		  data: 'access_token=' + this.model.google_access_token + '&max-results=1000&alt=json',
		  error: function(err) {
		  	console.log(err); 
		  },
		  success: function(data) { 
		  	console.log(data);
		  	console.log("Fetched " + data.feed.entry.length + " Contacts.  Formatting them now...");
		  	self.importGoogleContacts(data.feed.entry );
		  } // success
		}); // ajax
	},

	importGoogleContacts: function(gContacts, callback) {
		  // Google contacts have categories and primary properties for phonenumbers, emails, You have to check for those.
		  // console.log("Raw Contact Data: ", contacts);
		  console.log("Google Contacts: ", gContacts);
		  var googleContacts = [];
		  $(gContacts).each(function(index, contact) {
		        // Create Empty Contact Object
		        var googleContact                 = {}
		        // Save Title
		          if (contact.title['$t']) { googleContact.title = contact.title['$t'] }
		          if (contact.title['$t'] === "Lake Havasu Phone Book") { console.log(contact) };
		        // Save Emails
		          if (contact['gd$email']) {
		              googleContact.emails              = {}
		              googleContact.emails.categorized  = []
		              googleContact.emails.all          = [] 
		              googleContact.emails.primary      = ''      
		              // Iterate through emails array and pull the primary
		              $(contact['gd$email']).each(function(index, emailObject) {
		                  // Add email to all emails array
		                  googleContact.emails.all.push(emailObject.address);
		                  // See if marked as Primary  
		                  if (emailObject.hasOwnProperty('primary')) { 
		                      googleContact.emails.primary = emailObject.address
		                  }
		                  // See if marked as Category
		                  if (emailObject.hasOwnProperty('rel')) {
		                      var category                   = emailObject.rel.match(/#([\s\S]*)$/)[1]; // Gmail returns categories within a link (it's strange) use regex to extract category from link
		                      var categorizedEmail           = {}
		                      categorizedEmail.category      = category
		                      categorizedEmail.address       = emailObject.address
		                      googleContact.emails.categorized.push(categorizedEmail)
		                  } else {
		                      var uncategorizedEmail         = {}
		                      uncategorizedEmail.category    = 'no category'
		                      uncategorizedEmail.address     = emailObject.address
		                      googleContact.emails.categorized.push(uncategorizedEmail)
		                  }
		              });
					  // Set Primary Email if one is not found.
					  if (googleContact.emails.primary === '') {
	                      googleContact.emails.primary = googleContact.emails.all.shift();
					  };
		          }; // End if to check if contact has email property

		          // Save Phone Numbers
		              if (contact['gd$phoneNumber']) {
		                  googleContact.phone_numbers              = {}
		                  googleContact.phone_numbers.categorized  = []
		                  googleContact.phone_numbers.all          = [] 
		                  googleContact.phone_numbers.primary      = '' 
		                  // Iterate through number array
		                  $(contact['gd$phoneNumber']).each(function(index, numberObject) {
		                      // Add number to all numbers array
		                      googleContact.phone_numbers.all.push( numberObject['$t'] );
		                      // See if marked as Primary  
		                      if (numberObject.hasOwnProperty('primary')) { 
		                          googleContact.phone_numbers.primary = numberObject['$t'];
		                      }
		                      // See if marked as Category
		                      if (numberObject.hasOwnProperty('rel')) {
		                          var category                        = numberObject.rel.match(/#([\s\S]*)$/)[1]; // Google Contacts returns categories within a link (it's strange) use regex to extract category from link
		                          var categorizedNumber               = {}
		                          categorizedNumber.category          = category
		                          categorizedNumber.phone_number      = numberObject['$t']
		                          googleContact.phone_numbers.categorized.push(categorizedNumber)
		                      } else if (numberObject.hasOwnProperty('label')) { 
		                          var categorizedNumber               = {}
		                          categorizedNumber.category          = numberObject.label;
		                          categorizedNumber.phone_number      = numberObject['$t']
		                          googleContact.phone_numbers.categorized.push(categorizedNumber)
		                      } else {
		                          var uncategorizedNumber             = {}
		                          uncategorizedNumber.category        = 'No Category'
		                          uncategorizedNumber.phone_number    = numberObject['$t']
		                          googleContact.phone_numbers.categorized.push(uncategorizedNumber)
		                      }
		                  }); // each
						  // Set Primary Number if one is not found.
						  if (googleContact.phone_numbers.primary === '') {
		                      googleContact.phone_numbers.primary = googleContact.phone_numbers.all.shift();
						  };
		              }; // End if to check for phone number

		          // Save Structured Postal Address
		              if (contact['gd$postalAddress']) {
		                  googleContact.addresses              = {}
		                  googleContact.addresses.categorized  = []
		                  googleContact.addresses.all          = [] 
		                  googleContact.addresses.primary      = ''      
		                  // Iterate through addresses array and pull the primary
		                  $(contact['gd$postalAddress']).each(function(index, addressObject) {
		                      // Add address to all address array
		                      googleContact.addresses.all.push(addressObject['$t']);
		                      // See if marked as Primary  
		                      if (addressObject.hasOwnProperty('primary')) { 
		                          googleContact.addresses.primary = addressObject['$t']
		                      }
		                      // See if marked as Category
		                      if (addressObject.hasOwnProperty('rel')) {
		                          var category                     = addressObject.rel.match(/#([\s\S]*)$/)[1]; // Gmail returns categories within a link (it's strange) use regex to extract category from link
		                          var categorizedAddress           = {}
		                          categorizedAddress.category      = category
		                          categorizedAddress.address       = addressObject['$t']
		                          googleContact.addresses.categorized.push(categorizedAddress)
		                      } else {
		                          var uncategorizedAddress         = {}
		                          uncategorizedAddress.category    = 'no category'
		                          uncategorizedAddress.address     = addressObject['$t']
		                          googleContact.addresses.categorized.push(uncategorizedAddress)
		                      };
		                  });
						  // Set Primary Address if one is not found.
						  if (googleContact.addresses.primary === '') {
						  	  googleContact.addresses.primary = googleContact.addresses.all.shift();
						  };
		              }; // End if statement to check for address

		          // Save Notes
		              if (contact.content) {
		                googleContact.notes = contact.content['$t']
		              }; // End if statement to check Updated property exists

		          // Save ID
		              if (contact.id) {
		              	googleContact.ids        = {};
		                googleContact.ids.google = contact.id['$t'].substr(contact.id['$t'].lastIndexOf('/') + 1);
		              }

		          // Save Update Date
		              if (contact['updated']) {
		                googleContact.updated = contact.updated['$t']
		              }; // End if statement to check Updated property exists

		          // Save Organization
		              if (contact['gd$organization']) {
		                googleContact.organizations = {}
		                googleContact.organizations.all = []
		                $(contact['gd$organization']).each(function(index, orgObject) {
		                      // Set Primary Organization
		                      if (orgObject.hasOwnProperty('primary')) { 
		                          googleContact.organizations.primary = orgObject['gd$orgName']['$t']
		                      }
		                      // Add All Organizations To List
		                      var organization   = {}
		                      if (orgObject['gd$orgName'])           { organization.name            = orgObject['gd$orgName']['$t']       }
		                      if (orgObject['gd$orgTitle'])          { organization.title           = orgObject['gd$orgTitle']['$t']      }
		                      if (orgObject['gd$orgDepartment'])     { organization.department      = orgObject['gd$orgDepartment']['$t'] }
		                      if (orgObject['gd$orgJobDescription']) { organization.job_description = orgObject['gd$orgJobDescription']['$t'] }
		                      googleContact.organizations.all.push(organization);
		                }); // each
		              }; // End if statement to check if Organiation Property Exists

		        googleContacts.push(googleContact);
		  
		  }); // Each

		  // Save to Database
          var allContacts = new KAC.Collections.KACContacts()
    	  allContacts.create(googleContacts, {
	        success: function (response) {
	        	console.log(response.toJSON());
	        	KAC.Router.navigate("dashboard/contacts", {trigger: true})
	        },
	        error: function (model, xhr) {
	            console.log("error:", model,xhr)
	        }
		  }); // End of allContacts.save
	},

	listGoogleContacts: function(contacts) {
		console.log(contacts);
		this.$el.html(JST['screens/import/google/imported']({ user: self.model, contacts: contacts }));
		_.defer( function() {
			var tenContacts = contacts.slice(0,11);
			console.log(tenContacts);
			$(tenContacts).each(function(index, contact) { 
				if (contact.title) {
					$('#google-contacts-list').append('<div class="col-md-12 contact-list-item"><h6 class="centered">' + contact.title + '</h6></div>');
				};
			});
			$('#google-contacts-list').slideDown('slow');
	    });
	},

	render: function () {
		var self = this;
		this.$el.html(JST['screens/import/google/authenticated']({ user: this.model }));
		// Time interval before fetching Google Contacts
		setTimeout(function(){
			self.fetchGoogleAndUserContacts();
		},1000)
		return this;
	}

});