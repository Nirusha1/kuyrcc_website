let mongoose=require('mongoose');

//members schema
let memberSchema = mongoose.Schema({

	member_Fname:{type:String,require:false	},

	member_Mname:{type:String,require:false},

	member_Lname:{type:String,require:false},

	member_email:{type:String,require:false	},

	member_phone:{type:String,require:false	},

	member_address:{type:String,require:false	},

	member_DOB:{type:String,require:false	},

	member_blood:{type:String,require:false	},

	member_gender:{type:String,require:false	},

	member_department:{type:String,require:false},

	member_year:{type:String,require:false},

	member_moneyPaid:{type:String,require:false},

	member_position:{type:String,require:false},

	member_formSubmissionDate :{type:String,require:false},

	member_inUniversity:{type:Boolean,require:false}


});

let members = module.exports=mongoose.model('members', memberSchema);
