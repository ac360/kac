KAC.Views.ScreenImportGoogle = Backbone.View.extend({
	
	tagName: "div",
    id: "screen-import-google",
    className: "",

	initialize: function() {
	},

	events: {
	},

	fetchGoogleContacts: function() {
		var self = this;
		console.log("Now fetching Google Contacts...");
		// var authParams = { access_token: this.model.google_access_token, max-results: 1000, alt: 'json' }; // from Google oAuth

		$.ajax({
		  url: 'https://www.google.com/m8/feeds/contacts/default/full',
		  dataType: 'jsonp',
		  data: 'access_token=' + this.model.google_access_token + '&max-results=1000&alt=json',
		  error: function(err) {
		  	console.log(err); 
		  },
		  success: function(data) { 
		  	console.log("Fetched " + data.feed.entry.length + " Contacts.  Formatting them now...")
		  	KAC.formatGoogleContacts(data.feed.entry, function(googleContacts){
		  		self.listGoogleContacts(googleContacts);
		  	});
		  } // success
		}); // ajax
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
			self.fetchGoogleContacts();
		},3500)
		return this;
	}

});