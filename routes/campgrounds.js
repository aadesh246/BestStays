var express = require("express");
var router = express.Router();

var Campground= require("../models/campground.js")
router.get("/campgrounds",function(req,res)
	    {
		Campground.find({},function(err,allcamps)
					   {
			if(err) console.log(err);
			else
			res.render("campgrounds/index.ejs",{arr:allcamps});});
		});
router.post("/campgrounds",isLoggedIn,function(req,res)
		{ var newName=req.body.name;
		  var newimg = req.body.image;
		 var desc = req.body.description;
		 var price = req.body.price;
		 var author ={
			 id:req.user._id, username:req.user.username
		 }
		 var newcamp = {name:newName,image:newimg,description:desc,author:author,price:price};
		 Campground.create(newcamp,function(err,camp)
						  {
			 if(err) console.log(err);else {req.flash("success","Successfully created a new campground.") ;res.redirect("/campgrounds");}
		 });
		
		});
router.get("/campgrounds/new",isLoggedIn,function(req,res)
		{
	     res.render("campgrounds/new.ejs");
		});
router.get("/campgrounds/:id",function(req,res)
	   {
	Campground.findById(req.params.id).populate("comments").exec(function(err,newc)
					   {
		if(err)console.log(err);
		else res.render("campgrounds/show.ejs",{newc:newc});
	
	});
});
router.get("/campgrounds/:id/edit",checkUserAuth,function(req,res)
		  {
		   Campground.findById(req.params.id,function(err,camp)
							  {
			   res.render("campgrounds/edit.ejs",{camp:camp});
		   });
		   });
router.put("/campgrounds/:id",checkUserAuth,function(req,res)
		  {
	Campground.findByIdAndUpdate(req.params.id,req.body.camp,function(err,updated)
								{
		req.flash("success","Successfully updated campground..");
		res.redirect("/campgrounds/"+updated._id);
	})
})
router.delete("/campgrounds/:id",checkUserAuth,function(req,res)
			 {
	Campground.findByIdAndRemove(req.params.id,function(err)
								{
		req.flash("success","Successfully removed campground..");
					res.redirect("/campgrounds");	 
		 })
})
function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated())
		return next();
	else{ req.flash("error","You need to be logged in to do that..");
		res.redirect("/login");}
}
function checkUserAuth(req,res,next)
{
	if(req.isAuthenticated())
		{
			Campground.findById(req.params.id,function(err,found)
							   {
				if(found.author.username===(req.user.username))
					return next();
				else{			req.flash("error","You are not authorized to do that");	res.redirect("back");
					}	
			});
			}
	else{req.flash("error","You need to be logged in to do that..");
		res.redirect("back");}
		
	
}

module.exports = router;
