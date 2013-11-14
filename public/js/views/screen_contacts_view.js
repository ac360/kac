KAC.Views.ScreenContacts = Backbone.View.extend({
	
	el: "#screen-container",

	initialize: function() {
		console.log("Now looking at the Contacts Screen");
		var userContacts = new KAC.Collections.KACContacts();
	    userContacts.fetch({
	        success: function (response) {
	            var contacts = response.toJSON();
	            var ContactsList = new KAC.Views.PartialContactsList({ collection: contacts });
	            $('#screen-container').html(ContactsList.render().$el);
	        } // End Success
	    });   // End fetch
	},

	events: {
	},

	render: function () {	
		return this;
	}

});