KAC.Views.ScreenImport = Backbone.View.extend({
	
	tagName: "div",
    id: "screen-import",
    className: "",
    template: JST['screens/import/import'],

	initialize: function() {
		var self = this;
		_.defer( function() { self.setImportStatus() } );
	},

	events: {

	},

	setImportStatus: function() {
		console.log("running", this.model)
		if (this.model.google_import   == true)   { $('#import-google-link').html('<i class="fa fa-check-square"></i> Google Contacts Imported').addClass('imported') };
		if (this.model.facebook_import == true)   { };
		if (this.model.linkedin_import == true)   { };
	},

	render: function () {
		this.$el.html(this.template({ user: this.model }));
		return this;
	}

});