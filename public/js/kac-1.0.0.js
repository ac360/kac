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
