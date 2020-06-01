var  express = require("express"),
	 app = express(),
	flash = require("connect-flash"),
	 bodyParser= require("body-parser"),
	 mongoose = require("mongoose"),
	 passport = require("passport"),
	 LocalStrategy = require("passport-local"),
	 passportLocalMongoose = require("passport-local-mongoose"),
	 
	 Comment = require("./models/comment.js"),
	 Campground= require("./models/campground.js"),
	 User = require("./models/user.js"),
	 methodOverride = require("method-override"),
	 seedf = require("./seed.js");

var campgroundRoutes = require("./routes/campgrounds.js"),
	commentRoutes = require("./routes/comments.js"),
	authRoutes = require("./routes/auth.js");
var passport = require('passport');

var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
mongoose.connect("mongodb+srv://aadesh:aadesh123@cluster0-pavwg.mongodb.net/test?retryWrites=true&w=majority",{
	useNewUrlParser:true,
	useCreateIndex:true
}).then(() =>{console.log("Connected")});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.use(flash());
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.use(new GoogleStrategy({
    clientID: "313017906178-sd6u4rtmg4arq0lcrqhlcv5g9mh9rh8s.apps.googleusercontent.com",
    clientSecret: "49ZCkG0VvmGhHm5LSu4tKfvl",
    callbackURL: "https://moviebuff.run-ap-south1.goorm.io/auth/google/callback",
	     passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, cb){
    process.nextTick(function()
					{
		User.findOne({"google.id":profile.id},function(err,user)
					{
			if(err)
				return cb(err);
			if(user)
			{ return cb(null,user);}
			else
				{
					var newUser = new User();
					newUser.username=profile.email;
					newUser.google.id= profile.id;
					newUser.google.token = accessToken;
					newUser.google.name = profile.displayName ;
				
				   newUser.save(function(err)
							   {
					   if(err)throw err;
					   else return cb(null,newUser);
				   }); 
				}
		});
		
	});
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.authenticate('local', { failureFlash: 'Invalid username or password.' });
passport.authenticate('local', { successFlash: 'Logged in successfully.' });

app.use(function(req,res,next)
	   {
	res.locals.currentUser=req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});
app.get("/",function(req,res)
		{
		res.render("home.ejs");	
        });

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT,function()
		  {
	console.log("YelpCamp has started");
});