var express = require("express");
var router = express.Router();
var Campground= require("../models/campground.js");
var Comment = require("../models/comment.js");
router.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res)
	   {
	Campground.findById(req.params.id,function(err,campground)
					   {
		res.render("comments/new.ejs",{campground:campground});
	});
});
router.post("/campgrounds/:id/comments",isLoggedIn,function(req,res)
		{
	Campground.findById(req.params.id,function(err,camp)
					   {
		Comment.create(req.body.comment,function(err,comm)
					  {
			
			comm.author.id = req.user._id;
			comm.author.username = req.user.username;
			comm.save();
			camp.comments.push(comm);
			camp.save();
			res.redirect("/campgrounds/"+camp._id);
		});
	});
});
router.get("/campgrounds/:id/comments/:iden/edit",checkUserAuth,function(req,res)
		  {
		   Campground.findById(req.params.id,function(err,camp)
							   {
			   Comment.findById(req.params.iden,function(err,comm)
							   {
							res.render("comments/edit.ejs",{campground:camp,comment:comm});
								});
		   })});
router.put("/campgrounds/:id/comments/:iden",checkUserAuth,function(req,res)
		  {
	Comment.findByIdAndUpdate(req.params.iden,req.body.comment,function(err,updated)
								{
		res.redirect("/campgrounds/"+req.params.id);
	})
})
router.delete("/campgrounds/:id/comments/:iden",checkUserAuth,function(req,res)
			 {
	Comment.findByIdAndRemove(req.params.iden,function(err)
							 {
		res.redirect("/campgrounds/"+req.params.id);
	})
})
function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated())
		return next();
	else
		res.redirect("/login");
}
function checkUserAuth(req,res,next)
{
	if(req.isAuthenticated())
		{
			Comment.findById(req.params.iden,function(err,comm)
							{
				if(comm.author.username==req.user.username)
					return next();
				else{req.flash("error", "You are not allowed to do that..");
					res.redirect("back");}
			});
		}
	else {req.flash("error","You need to be logged in to do that..");res.redirect("back");}
}

module.exports = router;
