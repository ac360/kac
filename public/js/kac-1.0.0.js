window.KAC = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
  	KAC.Router = new KAC.Routers.Main();
    if (!Backbone.history.started) {
            Backbone.history.start({ pushState: true });
            Backbone.history.started = true;
    }
  }
};

$(document).ready(function(){
  KAC.initialize();
});

// KAC Helper Functions

KAC.getCurrentUser = function() {
  var UserId = $('#logo').attr('data-id');

  var current_user = new KAC.Models.CurrentUser();
  current_user.fetch({
      success: function (response) {
          var result = response.toJSON();
          console.log("Here is the Current User Information:", result)
          return result;
      } // End Success
  }); // End fetch 
}

KAC.checkSetupStatus = function() {
  // Get Current User
  var UserId = $('#logo').attr('data-id');
  var current_user = new KAC.Models.CurrentUser();
  current_user.fetch({
      success: function (response) {
          var user = response.toJSON();
          console.log("Here is the Current User Information:", user);

          if ( user.google_import == false  && user.facebook_import == false && user.linkedin_import == false) {
            KAC.Router.navigate("dashboard/get_started", {trigger: true});
          }
          
      } // End Success
  }); // End fetch 
}

KAC.setMenu = function(menustate, user) {
  console.log("Menu State: ", menustate);
  if (menustate.primary == "import") {
        $('#menu-import-link').addClass('active');
        $('#submenu-import').show();
        // TODO - GET USER'S STATUS
        if (menustate.secondary_page == "google") {
            $('#import-google-link').addClass('active');
        } else if (menustate.secondary_page == "facebook") {
            $('#import-facebook-link').addClass('active');
        } else if (menustate.secondary_page == "linkedIn") {
            $('#import-linked-link').addClass('active');
        } else {
        }
  } else if (menustate.primary == "features") {
        $('#menu-features-link').addClass('active');
        $('#submenu-features').show();
        // TODO - GET USER'S STATUS
        if (menustate.secondary_page == "google") {
        } else if (menustate.secondary_page == "facebook") {
        } else if (menustate.secondary_page == "linkedIn") {
        } else {}
  } else if (menustate.primary == "settings") {
        $('#menu-settings-link').addClass('active');
  } else {
        $('#menu-contacts-link').addClass('active');
        $('#submenu-contacts').show();
        // Get Active Item
        if (menustate.secondary_page == "add") {
          $('#contacts-add-link').addClass('active');
        } else if (menustate.secondary_page == "remove") {
          $('#contacts-remove-link').addClass('active');
        } else {
          $('#contacts-list-link').addClass('active');
        }
  };

}

KAC.formatGoogleContacts = function(contacts, callback) {
  // Google contacts have categories and primary properties for phonenumbers, emails, You have to check for those.
  // console.log("Raw Contact Data: ", contacts);
  var googleContacts                = []

  $(contacts).each(function(index, contact) {
        
        if ( contact['gd$website'] ) {
          console.log(contact);      
        };

        var googleContact                 = {}
        
        // Save Title
          if (contact.title['$t']) { googleContact.title = contact.title['$t'] }
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
          }; // End if to check if contact has email property

          // Save Phone Numbers
              if (contact['gd$phoneNumber']) {
                  googleContact.phone_numbers              = {}
                  googleContact.phone_numbers.categorized  = []
                  googleContact.phone_numbers.all          = [] 
                  googleContact.phone_numbers.primary      = '' 
                  // Iterate through number array and pull the primary
                  $(contact['gd$phoneNumber']).each(function(index, numberObject) {
                      // Add number to all numbers array
                      googleContact.phone_numbers.all.push(numberObject['$t']);
                      // See if marked as Primary  
                      if (numberObject.hasOwnProperty('primary')) { 
                          googleContact.phone_numbers.primary = numberObject['$t']
                      }
                      // See if marked as Category
                      if (numberObject.hasOwnProperty('rel')) {
                          var category                        = numberObject.rel.match(/#([\s\S]*)$/)[1]; // Google Contacts returns categories within a link (it's strange) use regex to extract category from link
                          var categorizedNumber               = {}
                          categorizedNumber.category          = category
                          categorizedNumber.phone_number      = numberObject['$t']
                          googleContact.phone_numbers.categorized.push(categorizedNumber)
                      } else {
                          var uncategorizedNumber             = {}
                          uncategorizedNumber.category        = 'no category'
                          uncategorizedNumber.address         = numberObject['$t']
                          googleContact.phone_numbers.categorized.push(uncategorizedNumber)
                      }
                  }); // each
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
                          var category                   = addressObject.rel.match(/#([\s\S]*)$/)[1]; // Gmail returns categories within a link (it's strange) use regex to extract category from link
                          var categorizedAddress         = {}
                          categorizedAddress.category    = category
                          categorizedAddress.address     = addressObject['$t']
                          googleContact.addresses.categorized.push(categorizedAddress)
                      } else {
                          var uncategorizedAddress         = {}
                          uncategorizedAddress.category    = 'no category'
                          uncategorizedAddress.address     = addressObject['$t']
                          googleContact.addresses.categorized.push(uncategorizedAddress)
                      }
                  });
              }; // End if statement to check for address

          // Save Notes
              if (contact.content) {
                googleContact.notes = contact.content['$t']
              }; // End if statement to check Updated property exists

          // Save ID
              if (contact.id) {
                googleContact.id = contact.id['$t'].substr(contact.id['$t'].lastIndexOf('/') + 1);
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

  // if (googleContacts) { 
  //   $(googleContacts).each(function(index, contact) {
  //       if (contact.id) {
  //         console.log(contact);
  //       }
  //   })
  // };

  callback(googleContacts);

} // End formatGoogleContacts