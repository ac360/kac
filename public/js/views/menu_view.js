KAC.Views.Menu = Backbone.View.extend({
	
	el: "#menu-container",

	initialize: function() {
		var self = this;
	   // _.defer( function() { KAC.setMenu(self.options.menustate, self.options.user) } );
	    _.defer( function() { self.setImportConnectionStatus() } );
	},

	events: {
		"click .primary-nav"	: 		"changePrimaryLink",
		"click .submenu-nav"    :       "changeSecondaryLink"
	},

	changePrimaryLink: function(e) {
		var self = this;
		$('#primary-nav').find('.active').removeClass('active');
		$(e.currentTarget).addClass('active');
		var link = $(e.currentTarget).attr('data-link');
		if (link == "contacts") {
			KAC.Router.navigate("dashboard/contacts",   {trigger: true});
		} else if (link == "import") {
			KAC.Router.navigate("dashboard/import",     {trigger: true});
		} else if (link == "features") {
			KAC.Router.navigate("dashboard/features",   {trigger: true});
		} else if (link == "settings") {
			KAC.Router.navigate("dashboard/settings",   {trigger: true});
		};
	},

	screenImport: function() {
		console.log("hello");
		var screenImport = new KAC.Views.ScreenImport({ model: this.model });
		$('#screen-container').html(screenImport.render().$el);
	},

	setImportConnectionStatus: function() {
		if (this.model.google_import == true)   {
			$('#import-google-link').html('<i class="check icon green"></i> Google')
		}
		if (this.model.facebook_import == true) {
			$('#import-facebook-link').html('<i class="check icon green"></i> Facebook')
		}
		if (this.model.linkedin_import == true)   {
			$('#import-linkedin-link').html('<i class="check icon green"></i> LinkedIn')
		}
	},

	screenImportGoogle: function() {
		var screenImportGoogle = new KAC.Views.ScreenImportGoogle({ user: this.model });
	},

	screenGetStarted: function() {
		var getstartedview = new KAC.Views.GetStarted();
      	$('#screen-container').html(getstartedview.render().$el);
	},

	render: function () {
		return this;
	}

});