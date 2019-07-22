const express = require('express');
const router =  express.Router();
//for email verification
const nodemailer = require('nodemailer');

//Bring in models
let dbvariable = require('../models/users');
let eventVariable = require('../models/events');
let contactVariable = require('../models/contacts')
let questionVariable = require('../models/questions');

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

router.post('/askQuestion',function(req,res){
	contactVariable.find({}, function(err, contacts){
	const questionBody = req.body.QuestionBody;
	req.checkBody('QuestionBody','Make sure field is not empty before submission').notEmpty();
	let errors =  req.validationErrors();
	if(errors){
		req.flash('success','Make sure field is not empty before submission');
		res.render('contacts',{
			errors:errors,
			contacts: contacts
		});}
		else{
			let x = new questionVariable();
				x.question_body= req.body.QuestionBody;
				x.user_email= req.body.user_Email;
			x.save(function(err){
				if(err){
					console.log(err);
					return;
				}else{
					req.flash('success','Your question has been posted');
					res.render('contacts',{
						contacts: contacts
					});
				}
			});
		}
	});
});

//add registration route
router.post('/sendReply/:id', function(req, res){

		//for email verification
		var transporter = nodemailer.createTransport({
		 service: 'gmail',
		 auth: {
		   //username and password of the sender is kept here
		        user: 'project.cropta@gmail.com',
		        pass: 'blank password'
		    }
		});

		var mailOptions = {
		    from: 'project.cropta@gmail.com',
		    to: req.body.user_email, // email is taken from FORM
		    subject: 'Thank You for your Review',
		    text: req.body.reply_text
		}

		transporter.sendMail(mailOptions, function (err, res) {
		    if(err){
					req.flash('danger','Reply cannot be sent');
					res.redirect('/users/contacts/checkQuestions');
		    } else {
					req.flash('success','Reply has been sent to'+req.body.user_email);
					questionVariable.deleteOne({_id:req.params.id},function(err,deleteQuestion){
						res.redirect('/users/contacts/checkQuestions');
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

//add routes for checking questions
router.get('/checkQuestions',function(req, res){
	questionVariable.find({},function(err,questions){
		res.render('checkQuestions',{
			title:'checkQuestions',
			questions:questions
		});
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
