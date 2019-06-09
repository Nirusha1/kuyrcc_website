let mongoose=require('mongoose');

//contacts schema
let replyCommentSchema = mongoose.Schema({

  reply_comment_id:{
    type:String,
    required: true
  },
  reply_event_id:{
    type:String,
    required: true
  },
  reply_user_id:{
    type:String,
    required: true
  },
  reply_userName:{
    type: String,
    required: true
  },
  reply_body:{
    type: String,
    required: true
  },
  reply_date :{
     type: String,
     required : true
  },
  reply_time:{
    type: String,
    required : true
  },
  reply_dateEdit :{
     type: String,
     required : false
  },
  reply_timeEdit:{
    type: String,
    required : false
  },
  reply_likes :{
     type: String,
     required : false
  }
});

let replies = module.exports=mongoose.model('replies', replyCommentSchema);
