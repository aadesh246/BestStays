var mongoose = require("mongoose");
var commentSchema = mongoose.Schema({
	text:String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	},
	rating:{type:Number,default:5},
	date:{type:Date,default:Date.now}
});
module.exports= mongoose.model("Comment",commentSchema);