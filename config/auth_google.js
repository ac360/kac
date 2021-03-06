// Google OAuth2
var express         =   require('express')
var googleapis      = 	require('googleapis')
var OAuth2Client    = 	googleapis.OAuth2Client;
var app             =   express();

// Gets Google Authentication - TODO: Put these as ENV Configs

var CLIENT_ID       	= 	'536518698309.apps.googleusercontent.com'
var CLIENT_SECRET   	= 	'vEtS_zEU9FyGKRSobUzFBoZt'
var GOOGLE_REDIRECT_URL =   process.env.GOOGLE_REDIRECT_URL  ||  'http://localhost:3000/auth/google/callback';
var SCOPE           	=   'https://www.google.com/m8/feeds'
var oauth2Client    	= 	new OAuth2Client(CLIENT_ID, CLIENT_SECRET, GOOGLE_REDIRECT_URL);

	// generates a url that allows offline access and asks permissions
	// for Google+ scope.
	var url = oauth2Client.generateAuthUrl({
	  access_type: 'offline',
	  scope: SCOPE
	});

	exports.google_auth_link   = url;
	exports.google_auth_client = oauth2Client;


