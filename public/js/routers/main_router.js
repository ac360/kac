KAC.Routers.Main = Backbone.Router.extend({
	
	routes: { 
      ""                                       :              "home",
      "dashboard"                              :              "dashboard",
      "dashboard/contacts"                     :              "screenContacts",
      "dashboard/import"                       :              "screenImport",
      "dashboard/import/google"                :              "screenImportGoogle",
      "dashboard/get_started"                  :              "screenGetStarted"
    },

    initialize: function() {
    }, // /initialize

    home: function() {
      console.log("Welcome to the home page!")
    }, // /home

    dashboard: function() {
      var self = this;
      // Get Current User & Check Status
      var UserId = $('#logo').attr('data-id');
      var current_user = new KAC.Models.CurrentUser();
      current_user.fetch({
          success: function (response) {
              var user = response.toJSON();
              console.log("Here is the Current User Information:", user);
              // Load Menu View
              var menuview = new KAC.Views.Menu({ model: user });
              // If User Has No Contacts Or Is New
              if ( user.google_import == false  && user.facebook_import == false && user.linkedin_import == false) {
                console.log("redirecting...");
                KAC.Router.navigate("dashboard/import", {trigger: true})
              } else {
                // DEFAULT HOME PAGE - CONTACTS LIST?
              };
          } // End Success
      }); // End fetch 
    },

    screenImport: function() {
      var current_user = new KAC.Models.CurrentUser();
      current_user.fetch({
          success: function (response) {
              // Load Menu View
              var menuview = new KAC.Views.Menu({ model: response.toJSON() });
              var screenImport = new KAC.Views.ScreenImport({ model: response.toJSON() });
              $('#screen-container').html(screenImport.render().$el);
          } // End Success
      }); // End fetch
    },

    screenImportGoogle: function() {
        var current_user = new KAC.Models.CurrentUser();
        current_user.fetch({
            success: function (response) {
                var user = response.toJSON();
                // Load Menu View
                var menuview = new KAC.Views.Menu({ model: user });
                var screenImportGoogle = new KAC.Views.ScreenImportGoogle({ model: user });
                $('#screen-container').html(screenImportGoogle.render().$el);
            } // End Success
        }); // End fetch
    },

    screenImportGoogleImported: function() {
      var current_user = new KAC.Models.CurrentUser();
        current_user.fetch({
            success: function (response) {
                var user = response.toJSON();
                // Load Menu View
                var menuview = new KAC.Views.Menu({ model: user });
                var screenImportGoogleImported = new KAC.Views.ScreenImportGoogleImported({ model: user });
                $('#screen-container').html(screenImportGoogleImported.render().$el);
            } // End Success
        }); // End fetch
    }, 

    screenContacts: function() {
      var current_user = new KAC.Models.CurrentUser();
      current_user.fetch({
          success: function (response) {
              var user = response.toJSON();
              var screenContacts = new KAC.Views.ScreenContacts({ model: user });
          } // End Success
      }); // End fetch
    },

    importGoogleContacts: function() {
      console.log("hello from google import contats area");
    },

    importFacebookContacts: function() {
      console.log("hi there!")
    }

}); // KAC.Router

