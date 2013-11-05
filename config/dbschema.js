var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var SALT_WORK_FACTOR = 10

exports.mongoose = mongoose;

// Database connect
var uristring = 
  process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL  || 
  'mongodb://localhost/kac_dev_database';

var mongoOptions = { db: { safe: true }};

mongoose.connect(uristring, mongoOptions, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Successfully connected to: ' + uristring);
  }
});

// Database schema TODO add more validation
var Schema   = mongoose.Schema 
var ObjectId = Schema.ObjectId

// User schema
var userSchema = new Schema({
  email: 		 			{ type: String,  required: true, unique: true },
  password: 	 			{ type: String,  required: true  },
  admin: 		 			{ type: Boolean, required: true  },
  google_access_token:  	{ type: String,  required: false },
  google_refresh_token: 	{ type: String,  required: false },
  google_auth:   			{ type: Boolean, required: true, default: false},
  google_import: 			{ type: Boolean, required: true, default: false},
  facebook_auth: 			{ type: Boolean, required: true, default: false},
  facebook_import:  		{ type: Boolean, required: true, default: false},
  linkedin_auth:    		{ type: Boolean, required: true, default: false},
  linkedin_import:  		{ type: Boolean, required: true, default: false}
});

// Bcrypt middleware
userSchema.pre('save', function(next) {
	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
};

// Export user model
var userModel     = mongoose.model('User', userSchema);
exports.userModel = userModel;