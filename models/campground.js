var mongoose = require("mongoose");
var campSchema = new mongoose.Schema({
	name:String,
	image:String,
	description:String,
	price:String,
	created:{type:Date,default:Date.now},
	comments:[{
	type:mongoose.Schema.Types.ObjectId,
		ref:"Comment"
	
}],
	author:
	{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	}
}
);
var Campground = mongoose.model("Campground",campSchema);
module.exports=Campground;