KAC.Views.ScreenImportGoogleImported = Backbone.View.extend({
	
	tagName: "div",
    id: "screen-import-google-imported",
    className: "",
    template: JST['screens/import/google/imported'],

	initialize: function() {
		var self = this;
		// _.defer( function() { self.setImportStatus() } );
	},

	events: {

	},

	render: function () {
		this.$el.html(this.template({ user: this.model }));
		return this;
	}

});