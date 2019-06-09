let mongoose=require('mongoose');

//contacts schema
let commentEventSchema = mongoose.Schema({
  comment_event_id:{
    type:String,
    required: true
  },
  comment_user_id:{
    type:String,
    required: true
  },
  comment_userName:{
    type: String,
    required: true
  },
  comment_body:{
    type: String,
    required: true
  },
  comment_date :{
     type: String,
     required : true
  },
  comment_time:{
    type: String,
    required : true
  },
  comment_dateEdit :{
     type: String,
     required : false
  },
  comment_timeEdit:{
    type: String,
    required : false
  },
  comment_likes :{
     type: String,
     required : false
  },
  comment_replies:{
    type: String,
    required : false
  }
});

let Comments = module.exports=mongoose.model('comments', commentEventSchema);
