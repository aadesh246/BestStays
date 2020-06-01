var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user.js");
router.get("/register",function(req,res)
	   {
	res.render("register.ejs");
});
router.post("/register",function(req,res)
		{
	    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register.ejs",{error:err});
        }
        passport.authenticate("local")(req, res, function(){
          { req.flash("success","Sign up successful");res.redirect("/campgrounds"); }
        });
    });

});
router.get("/login", function(req,res)
	   {
	res.render("login.ejs");
});
router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login",
failureFlash:true,
successFlash:true}),
	function(req,res)
		{
	
});
router.get("/logout",function(req,res)
	   {
	req.logout();
	req.flash("success","You have been logged out");
	res.redirect("/campgrounds");
});
function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated())
		return next();
	else
		res.redirect("/login");
}

router.get('/auth/google',
  passport.authenticate('google', { scope: 
      [ 'https://www.googleapis.com/auth/plus.login',
      , 'https://www.googleapis.com/auth/plus.profile.emails.read',"email" ] }
));

router.get( '/auth/google/callback', 
    passport.authenticate( 'google', { 
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
}));
module.exports = router;
