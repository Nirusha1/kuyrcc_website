let mongoose=require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

//users schema
let userSchema=mongoose.Schema({
	name:{
		type:String,
		required: true
	},
	email:{
		type:String,
		required: true,
		unique: true
	},
	user_auth:{
		type:Boolean,
		required:true
	},
	random_number:{
		type:String,
		required:false
	},
	pwd:{
		type:String,
		required: true
	},
	conpwd:{
		type:String,
		required: true
	},
	deleteDate:{
		type:String,
		required: false
<<<<<<< HEAD
	},
	position:{
		type:String,
		required: false
=======
>>>>>>> 241ab1d7d3e2c7c5417beecf5e5e642880e8e90e
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
