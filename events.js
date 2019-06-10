let mongoose=require('mongoose');

//events schema
let eventSchema = mongoose.Schema({
	event_UserName:{
		type:String,
		required: true
	},
	event_Userid:{
		type:String,
		required: true
	},
	event_name:{
		type:String,
		required: true
	},

	event_body:{
		type:String,
		required: true
	},

	event_location:{
		type:String,
		required: true
	},

	event_date:{
		type:String,
		required: true
	},

	event_image_path:{
		type:String
	}
});

let Events = module.exports=mongoose.model('events', eventSchema);
