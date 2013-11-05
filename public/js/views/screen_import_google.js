KAC.Views.ScreenImportGoogle = Backbone.View.extend({
	
	tagName: "div",
    id: "screen-import-google",
    className: "col-md-12",
    template: JST['screens/import/google/unauthenticated'],
    template2: JST['screens/import/google/authenticated'],
    template3: JST['screens/import/google/imported'],

	initialize: function() {
		console.log(window)
		// if      (this.options.user.google_auth   == false) { this.template = this.options.template1  }
		// else if (this.options.user.google_import == false) { this.template = this.options.template2  }
		// else if (this.options.user.google_import == true ) { this.template = this.options.template3  };
		$('#screen-container').html(this.render().$el);
	},

	events: {
	},

	render: function () {
		this.$el.html(this.template({ user: this.options.user }))
		console.log(this.template1)
		return this;
	}

});