KAC.Views.GetStarted = Backbone.View.extend({
	
	tagName: "div",
    id: "",
    className: "row",
    template: JST['main/get_started'],

	initialize: function() {
	},

	events: {
	},

	render: function () {
		console.log("here")
	    this.$el.html(this.template())
		return this;
	}

});