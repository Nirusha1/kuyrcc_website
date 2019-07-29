let mongoose=require('mongoose');

//contacts schema
let contactSchema = mongoose.Schema({
  Name:{
    type:String,
    required: true

  },
  Email:{
    type: String,
    required: false

  },
  Position:{
    type: String,
    required: false
  }

});

let Contacts = module.exports=mongoose.model('contacts', contactSchema);
