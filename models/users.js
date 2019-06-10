let mongoose=require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

//users schema
let userSchema=mongoose.Schema({
	name:{
		type:String,
		required: true,
		unique:true
	},
	email:{
		type:String,
		required: true,
		unique: true
	},

	pwd:{
		type:String,
		required: true
	},
	conpwd:{
		type:String,
		required: true
	}
});

userSchema.plugin(uniqueValidator);
var user= module.exports=mongoose.model('Users',userSchema);


//user defined functions
module.exports.findUserByEmail = function(email,callback){
	var query = {email : email};
	user.findOne(query,callback);
	console.log(user.findOne(query));
	return user;
}
