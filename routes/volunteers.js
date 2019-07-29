const express = require('express');
const router =  express.Router();

//Bring in models
let dbvariable = require('../models/users');
let eventVariable = require('../models/events');
let contactVariable = require('../models/contacts');
let volunteerVariable=require('../models/volunteers');

//add routes for creating events
router.get('/CreateVolunteers/:eventid', function(req, res){
	eventVariable.findById(req.params.eventid, function(err, events){
		res.render('volunteers',{
			events: events
		});
	});
});

router.post('/CreateVolunteers/:eventid', function(req, res){
	console.log('submitted Volunteer form');
	let x= new volunteerVariable();
	x.volunteer_eventid=req.params.eventid;
	x.volunteer_name=req.body.volunteer_name;
	x.volunteer_address=req.body.volunteer_address;
	x.volunteer_phone=req.body.volunteer_phone;
	x.volunteer_fb=req.body.volunteer_fb;
	x.volunteer_email=req.body.volunteer_email;

	req.checkBody('volunteer_name','Name is required').notEmpty();
	req.checkBody('volunteer_address','Address is required').notEmpty();
	req.checkBody('volunteer_phone','Phone is required').notEmpty();
	req.checkBody('volunteer_fb','Facebook Contact is required').notEmpty();
	req.checkBody('volunteer_email','Email is required').isEmail();

	let errors = req.validationErrors();
	if(errors){
		eventVariable.findById(req.params.eventid, function(err, events){
		res.render('volunteers',{
			events: events,
			errors:errors
		});
	});
	}else{

		let query = {_id:req.params.id}

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
	}
});


router.get('/ViewVolunteers/:eventid', function(req, res){
	volunteerVariable.find({volunteer_eventid:req.params.eventid}, function(err, volunteers){
		if(err){
			console.log(err);
		}
		else{
			eventVariable.findById(req.params.eventid, function(err, events){
				res.render('view_volunteers',{
					title:'All Events',
					volunteers : volunteers,
					events:events

				});
			});
		}
	});
});

module.exports = router;
