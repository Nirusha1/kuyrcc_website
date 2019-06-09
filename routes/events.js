const express = require('express');
const router =  express.Router();

//Bring in models
let dbvariable = require('../models/users');
let eventVariable = require('../models/events');
let contactVariable = require('../models/contacts')
let commentVariable = require('../models/commentEvent')
let replyVariable = require('../models/replyToComment')

//users Events
//add routes for creating events
router.get('/CreateEvent',ensureAuthenticated, function(req, res){
	res.render('events',{
		title:'Events'
	});
});

//Get Single Event
router.get('/:id', function(req, res){
	eventVariable.findById(req.params.id, function(err, events){
		res.render('single_event',{
			events: events
		});
	});
});
//for checking if events are created in database or not route
router.get('/events/single_event', function(req, res){
	eventVariable.find({}, function(err, events){
		if(err){
			console.log(err);
		}
		else{
			res.render('eventList',{
				title:'All Events',
				events: events
			});
		}
	});
});

//add event creation and submission route
router.post('/CreateEvent', function(req, res){
	console.log('submitted');
	let x= new eventVariable();
	x.event_name=req.body.event_name;
	x.event_body=req.body.event_body;
	x.event_UserName = req.user.name; 	//to show who has posted the event
	x.event_Userid = req.user.id
	x.event_location=req.body.event_location;
	x.event_date=req.body.event_date;

	x.save(function(err){
		if(err){
			console.log(err);
			return;
		}
		else{
			res.redirect('/');
		}
	});
	return;
});

//Access Control
function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	else{
		req.flash('danger', 'Please Login');
		res.redirect('/frontend');

	}
}

//Edit Event
router.get('/edit/:id',ensureAuthenticated,  function(req, res){
	eventVariable.findById(req.params.id, function(err, events){
		res.render('edit_event',{
			events: events
		});
	});
});

//update event submission route
router.post('/edit/:id', function(req, res){
	let x= {};
	x.event_name=req.body.event_name;
	x.event_body=req.body.event_body;
	x.event_location=req.body.event_location;
	x.event_date=req.body.event_date;

	let query = {_id:req.params.id}
	eventVariable.update(query, x, function(err){
		if(err){
			console.log(err);
			return;
		}
		else{
			res.redirect('/');
		}
	});

	return;
	console.log('updated');
});

//deleting events
router.delete('/:id',ensureAuthenticated,  function(req, res){
	let query = {_id:req.params.id}
	eventVariable.remove(query, function(err){
		if(err){
			console.log(err);
		}
		res.send('success');
	});
});

//comments and replies
//Comment for Event
router.get('/comment/:id',ensureAuthenticated,  function(req, res){
	commentVariable.find({comment_event_id:req.params.id}, function(err, comments){
	replyVariable.find({},function(err,replies){
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
router.post('/comment/:eventId/addComment/', function(req, res){

	let currentTime = new Date();
	let date = currentTime.getFullYear()+'-'+(currentTime.getMonth()+1)+'-'+currentTime.getDate();
	let time = currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();
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
router.post('/comment/:id/updateComment/', function(req, res){
	let currentTime = new Date();
	let date = currentTime.getFullYear()+'-'+(currentTime.getMonth()+1)+'-'+currentTime.getDate();
	let time = currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();
	let x= {};
	//x.comment_event_id=req.params.id;
	//x.comment_user_id = req.user.id;
	//x.comment_userName = req.user.name;
	x.comment_body = req.body.update_commentBody;
	x.comment_dateEdit = date;
	x.comment_timeEdit = time;
	//x.comment_likes = null;
	//x.comment_replies = null;

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
router.delete('/comment/:eventID/:commentId',ensureAuthenticated,  function(req, res){
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
router.get('/comment/:eventID/:commentID/deleteComment', function(req, res){
	replyVariable.find({},function(err,replies){
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
router.post('/comment/:eventId/addReply/', function(req, res){
	let currentTime = new Date();
	let date = currentTime.getFullYear()+'-'+(currentTime.getMonth()+1)+'-'+currentTime.getDate();
	let time = currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();
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
router.post('/comment/:id/updateReply/', function(req, res){
	let currentTime = new Date();
	let date = currentTime.getFullYear()+'-'+(currentTime.getMonth()+1)+'-'+currentTime.getDate();
	let time = currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();
	let x= {};
		//x.reply_event_id=req.params.id;
		//x.reply_comment_id=req.body.commentId_forUpdatingReply
		//x.reply_user_id = req.user.id;
		//x.reply_userName = req.user.name;
		x.reply_body = req.body.update_replyBody;
		x.reply_dateEdit = date;
		x.reply_timeEdit = time;
		//x.reply_likes = null;

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
router.get('/comment/:eventID/:replyID/deleteReply/', function(req, res){
	replyVariable.findOneAndDelete(req.params.replyID,function(err,deletedReply){
		eventVariable.findById(req.params.eventID, function(err, events){
			commentVariable.find({comment_event_id:req.params.eventID}, function(err, comments){
				replyVariable.find({},function(err,replies){
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
