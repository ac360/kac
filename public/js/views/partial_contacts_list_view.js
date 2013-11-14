KAC.Views.PartialContactsList = Backbone.View.extend({
	
	tagName: "div",
    id: "contacts-list-container",
    className: "row",

	initialize: function() {
		console.log("User's Contacts: ", this.collection);
	},

	events: {
		"click .contact"        :       "expandContact"
	},

	addContacts: function() {
		$(this.collection).each(function(index, contact) { 
			if (contact.title) {
				var header = contact.title;
			} else if (contact.emails.primary) {
				var header = contact.emails.primary;
			} else if (contact.phone_numbers.primary) {
				var header = contact.phone_numbers.primary;
			};
			$('#contacts-list').append('<li class="contact contact-closed" data-id="' + contact._id + '"><h1 class="contact-title">' + header + '</h1><div id="contact-expanded"></div></li>')
		});
	},

	expandContact: function(e) {
		// Animation
		if ( $(e.currentTarget).hasClass('contact-open') ) {
			$(e.currentTarget).removeClass('contact-open');
			$(e.currentTarget).addClass('contact-closed');
			$(e.currentTarget).children('#contact-expanded').fadeOut(300);
			$(e.currentTarget).animate({ height: 50 }, 300);
			console.log("open");
		} else if ( $(e.currentTarget).hasClass('contact-closed') ) {
			console.log("closed");
			$('.contact').children('#contact-expanded').fadeOut(300);
			$(e.currentTarget).animate({ height: 300 }, 300, function() {
				// var contactTopPosition = $(e.currentTarget).position().top;
				// console.log(contactTopPosition);
				// $('#contacts-list').animate({scrollTop: contactTopPosition});
			});
			$(e.currentTarget).children('#contact-expanded').fadeIn('slow');
			$('.contact-open').animate({ height: 50 }, 300);
			$('.contact').removeClass('contact-open');
			$('.contact').addClass('contact-closed');
			$(e.currentTarget).removeClass('contact-closed');
			$(e.currentTarget).addClass('contact-open');
		};
		// Add Information
		var contactID = $(e.currentTarget).attr('data-id');
		var model = _.where(this.collection, {_id: contactID});
		model = model.shift();
		console.log("You clicked on this contact: ", model);
		var htmlTitle = '';
		var htmlEmails = '';
		var htmlPhoneNumbers  = '';
		var htmlAddresses = '';
		var htmlOrganization  = '';
		if (model.organizations) {
			var organization  = model.organizations.all[0];
			console.log(organization);
			htmlOrganization  = '<h3 class="contact-organization">' + organization.name + '</h3>' 
		};
		if (model.phone_numbers) {
			htmlPhoneNumbers  = '<h5 class="contact-phone-number-primary">' + model.phone_numbers.primary + '</h5>'
			$(model.phone_numbers.categorized).each(function(index, number) { 
				htmlPhoneNumbers  = htmlPhoneNumbers + '<h6 class="contact-phone-number"><span class="contact-phone-number-category">' + number.category + ': </span>' + number.phone_number + '</h6>'
			});
		};
		if (model.emails) {
			htmlEmails  = '<h5 class="contact-email-primary">' + model.emails.primary + '</h5>'
			$(model.emails.categorized).each(function(index, email) { 
				htmlEmails  = htmlEmails + '<h6 class="contact-email"><span class="contact-email-category">' + email.category + ': </span>' + email.address + '</h6>'
			});
		};
		if (model.addresses) {
			htmlAddresses  = '<h5 class="contact-address-primary">' + model.addresses.primary + '</h5>'
			$(model.addresses.categorized).each(function(index, address) { 
				htmlAddresses = htmlAddresses  + '<h6 class="contact-address"><span class="contact-address-category">' + address.category + ': </span>' + address.address + '</h6>'
			});
		};
		$(e.currentTarget).children('#contact-expanded').html(htmlOrganization + htmlPhoneNumbers + htmlEmails + htmlAddresses);
	},

	render: function () {	
		var self = this;
		this.$el.html(JST['screens/contacts/contacts_list']({}));	
		_.defer( function() {
			self.addContacts();	
	    });
		return this;
	}

});