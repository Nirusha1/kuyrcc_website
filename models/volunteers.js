let mongoose=require('mongoose');

//volunteers schema
let volunteerSchema = mongoose.Schema({
	volunteer_eventname:{
		type:String,
		required: true
	},
	volunteer_eventid:{
		type:String,
		required: true
	},
	volunteer_eventHolder:{
		type:String,
		required:true
	},
	volunteer_name:{
		type:String,
		require:false
	},

	volunteer_address:{
		type:String,
		require:false
	},

	volunteer_phone:{
		type:String,
		require:false
	},

	volunteer_fb:{
		type:String,
		require:false
	},

	volunteer_email:{
		type:String,
		require:false
	}

});

let Volunteers = module.exports=mongoose.model('volunteers', volunteerSchema);