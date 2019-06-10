const express = require('express');
const router =  express.Router();

//Bring in models
let dbvariable = require('../models/users');
let eventVariable = require('../models/events');
let contactVariable = require('../models/contacts');
let volunteerVariable=require('../models/volunteers');

//add routes for creating events
router.get('/CreateVolunteers', function(req, res){
	res.render('volunteers',{
		title:'volunteers'
	});
});

router.post('/CreateVolunteers', function(req, res){
	console.log('submitted Volunteer form');
	let x= new volunteerVariable();
	x.volunteer_eventname=req.Events.event_name;
	x.volunteer_eventHolder = req.body.volunteer_name;	//to show who has posted the event
	x.volunteer_eventid = req.body.volunteer_name;
	x.volunteer_name=req.body.volunteer_name;
	x.volunteer_address=req.body.volunteer_address;
	x.volunteer_phone=req.body.volunteer_phone;
	x.volunteer_fb=req.body.volunteer_fb;
	x.volunteer_email=req.body.volunteer_email;

	

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


router.get('/ViewVolunteers', function(req, res){
	volunteerVariable.find({}, function(err, volunteers){
		if(err){
			console.log(err);
		}
		else{
			res.render('view_volunteers',{
				title:'All Events',
				volunteers : volunteers

			});
		}
	});
});

module.exports = router;