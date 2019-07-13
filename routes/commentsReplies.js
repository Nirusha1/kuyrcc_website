const express = require('express');
const router =  express.Router();

//Bring in models
let eventVariable = require('../models/events');
let commentVariable = require('../models/commentEvent');
let replyVariable = require('../models/replyToComment');

let dateTime = require('date-and-time');

//comments and replies
//Adding Comment for Event
router.get('/:id',  function(req, res){
	commentVariable.find({comment_event_id:req.params.id}, function(err, comments){
	replyVariable.find({reply_event_id:req.params.id},function(err,replies){
	eventVariable.findById(req.params.id, function(err, events){
		res.render('comment_event',{
			events: events,
			comments: comments,
			replies : replies
		});
	});
	});
	});
});

//adding comment to the event
router.post('/:eventId/addComment/', function(req, res){

	let now = new Date();
	let date = dateTime.format(now, 'ddd MMM DD YYYY');
	let time = dateTime.format(now, 'hh:mm A ');
	let x= new commentVariable();
	x.comment_event_id=req.params.eventId;
	x.comment_user_id = req.user.id;
	x.comment_userName = req.user.name;
	x.comment_body = req.body.commentBody;
	x.comment_date = date;
	x.comment_time = time;
	x.comment_likes = null;
	x.comment_replies = null;

	x.save(function(err){
		if(err){
			console.log(err);
			return;
		}
		else{
			res.redirect('/users/eventList/comment/' + req.params.eventId);
		}
	});
	return;
});

//update comment in event
router.post('/:id/updateComment/', function(req, res){
	let now = new Date();
	let date = dateTime.format(now, 'ddd MMM DD YYYY');
	let time = dateTime.format(now, 'hh:mm A ');
	let x= {};
	x.comment_body = req.body.update_commentBody;
	x.comment_dateEdit = date;
	x.comment_timeEdit = time;

	let comment_id = req.body.commentId_forUpdate
	let query = {_id:comment_id}
	commentVariable.update(query, x, function(err){
		if(err){
			console.log(err);
			return;
		}
		else{
			res.redirect('/users/eventList/comment/' + req.params.id);
		}
	});
});

//deleting events
router.delete('/:eventID/:commentId',ensureAuthenticated,  function(req, res){
	let comment_id = req.params.commentId;
	console.log(comment_id);
	req.flash('success',comment_id);
	let query = {_id:comment_id}
	commentVariable.remove(query, function(err){
		if(err){
			console.log(err);
		}
		res.redirect('/');
		res.send('success');
	});
});

//deleting comments
router.get('/:eventID/:commentID/deleteComment', function(req, res){
	replyVariable.find({reply_event_id:req.params.eventID},function(err,replies){
		commentVariable.findOneAndDelete(req.params.commentID, function(err,deletedComments){
			eventVariable.findById(req.params.eventID, function(err, events){
				commentVariable.find({comment_event_id:req.params.eventID}, function(err, comments){
					res.render('comment_event',{
						events: events || null,
						comments : comments,
						replies: replies || null
					});
				});
			});
		});
	});
});

//adding replies to comment of the event
router.post('/:eventId/addReply/', function(req, res){
	let now = new Date();
	let date = dateTime.format(now, 'ddd MMM DD YYYY');
	let time = dateTime.format(now, 'hh:mm A ');
	let x= new replyVariable();
	x.reply_event_id=req.params.eventId;
	x.reply_comment_id=req.body.reply_comment_id
	x.reply_user_id = req.user.id;
	x.reply_userName = req.user.name;
	x.reply_body = req.body.replybody;
	x.reply_date = date;
	x.reply_time = time;
	x.reply_likes = null;

	x.save(function(err){
		if(err){
			console.log(err);
			return;
		}
		else{
			res.redirect('/users/eventList/comment/' + req.params.eventId);
		}
	});
	return;
});

//update reply in comment
router.post('/:id/updateReply/', function(req, res){
	let now = new Date();
	let date = dateTime.format(now, 'ddd MMM DD YYYY');
	let time = dateTime.format(now, 'hh:mm A ');
	let x= {};
		x.reply_body = req.body.update_replyBody;
		x.reply_dateEdit = date;
		x.reply_timeEdit = time;

	let reply_id = req.body.replyId_forUpdate
	let query = {_id:reply_id}
	replyVariable.update(query, x, function(err){
		if(err){
			console.log(err);
			return;
		}
		else{
			res.redirect('/users/eventList/comment/' + req.params.id);
		}
	});
});

//deleting reply
router.get('/:eventID/:replyID/deleteReply/', function(req, res){
	replyVariable.findOneAndDelete(req.params.replyID,function(err,deletedReply){
		eventVariable.findById(req.params.eventID, function(err, events){
			commentVariable.find({comment_event_id:req.params.eventID}, function(err, comments){
				replyVariable.find({reply_event_id:req.params.eventID},function(err,replies){
					res.render('comment_event',{
						events: events,
						comments : comments,
						replies: replies
					});
				});
			});
		});
	});
});

module.exports = router;
