const express = require('express');
const router =  express.Router();

//Bring in models
let dbvariable = require('../models/users');
let eventVariable = require('../models/events');
let contactVariable = require('../models/contacts')

//for checking if contacts are created in database or not route
router.get('/', function(req, res){
	contactVariable.find({}, function(err, contacts){
		if(err){
			console.log(err);
		}
		else{
			res.render('contacts',{
				title:'All Contacts',
				contacts: contacts
			});
		}
	});
});

//add routes for creating contact
router.get('/add_contact', ensureAuthenticated,function(req, res){
	res.render('add_contact',{
		title:'Contacts'

	});

});

//Get Single Contact
router.get('/:id', function(req, res){
	contactVariable.findById(req.params.id, function(err, contacts){
		res.render('single_contact',{
			contacts: contacts

		});
	});

});

//Add contact submission route
router.post('/add_contact', function(req, res){
	let x = new contactVariable();
	x.Name = req.body.Name;
	x.Email_id = req.body.Email_id;
	x.Mobile_no = req.body.Mobile_no;

	x.save(function(err){
		if (err){
			console.log(err);
			return;
		}
		else{
			res.redirect('/users/contacts');
			return;
		}
	});
});

//Edit Contact
router.get('/edit/:id', ensureAuthenticated, function(req, res){
	contactVariable.findById(req.params.id, function(err, contacts){
		res.render('edit_contact',{
			contacts: contacts

		});
	});

});

//updated contact submission route
router.post('/edit/:id', function(req, res){
	let x= {};
	x.Name=req.body.Name;
	x.Email_id=req.body.Email_id;
	x.Mobile_no=req.body.Mobile_no;

	//console.log(req.body.event_name);

	let query = {_id:req.params.id}
	contactVariable.update(query, x, function(err){
		if(err){
			console.log(err);
			return;
		}
		else{
			res.redirect('/users/contacts');
		}
	});

	return;
	console.log('updated');
});

//Delete contact
router.delete('/:id', ensureAuthenticated,function(req, res){
	let query = {_id:req.params.id}
	contactVariable.remove(query, function(err){
		if(err){
			console.log(err);

		}
		res.send('success');
	});
});

module.exports = router;
