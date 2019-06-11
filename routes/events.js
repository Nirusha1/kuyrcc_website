const express = require('express');
const router =  express.Router();
const multer= require('multer');
const path= require('path');

var mongoose  = require('mongoose');


//Bring in models
let dbvariable = require('../models/users');
let eventVariable = require('../models/events');
let contactVariable = require('../models/contacts')
let commentVariable = require('../models/commentEvent')
let replyVariable = require('../models/replyToComment')

//Storage Engine
const storage= multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

//initialize upload
const upload = multer({
	storage: storage
}).single('events_image');


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
/* Nirusha commented it
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
*/

//add event creation and submission route
router.post('/CreateEvent', function(req, res){
	upload(req, res, (err)=>{
		if(err){
			console.log('error in event create route');
		}
		else{
			let fullPath = "uploads/" + req.file.filename;
			var document = {
				event_UserName:req.user.name,
				event_Userid:req.user.id,
				event_name:req.body.event_name,
				event_body:req.body.event_body,
				event_location:req.body.event_location,
				event_date:req.body.event_date,
				event_image_path: fullPath
			};
			let x = new eventVariable(document);
			x.save(function(error){
				if(error){
					throw error;
				}
				res.redirect('/');
			});
		}
	});
});



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
	x.eventVolunteerNo=req.body.eventVolunteerNo;

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

module.exports = router;
