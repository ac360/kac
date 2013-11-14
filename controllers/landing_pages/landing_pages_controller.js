var passport = require('passport');
var pass     = require("../../config/pass");

exports.index = function(req, res){
  res.render('index', { user: req.user, title: 'Keep-A-Contact', message: req.session.messages });
};

exports.signup = function (req, res) {
    var body = req.body;
    pass.createUser(
        body.email,
        body.password,
        body.password2,
        false,
        function (err, user) {
            if (err) return res.render('index', {user: req.user, message: err.code === 11000 ? "User already exists" : err.message});

            req.login(user, function (err) {
                if (err) {
                  console.log(err); 
                  return next(err);
                }
                // On Successful Login
                console.log("User Registered: ", user);
                res.redirect('/dashboard');
            })
        }
    )
}

exports.getlogin = function(req, res) {
  res.render('login', { user: req.user, message: req.session.messages });
};

exports.postlogin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];
      return res.redirect('/')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/dashboard');
    });
  })(req, res, next);
};