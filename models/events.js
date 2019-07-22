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
		required: false
	},

	event_date:{
		type:String,
		required: false
	},
	eventVolunteerNo:{
		type:String,
		require:false
	},
	event_createdDate:{
		type:String,
		required:false
	},
	event_deleteDate:{
		type:String,
		required:false
	},
	event_image_path:{
		type:String,
		required:false
	},
	event_type:{
		type:String,
		requred:false
	}

});

let Events = module.exports=mongoose.model('events', eventSchema);
