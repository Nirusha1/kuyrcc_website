const express = require('express');
const router =  express.Router();

//Bring in models
let memberVariable = require('../models/memberSchema');

//storing data to memberSchema
router.post('/form/',function(req,res){
	let x = new memberVariable();
	x.member_Fname=req.body.member_Fname;
	x.member_Mname = req.body.member_Mname;
	x.member_Lname = req.body.member_Lname;
	x.member_email = req.body.member_email;
	x.member_phone = req.body.member_phone;
	x.member_DOB = req.body.member_DOB;
	x.member_blood = req.body.member_blood;
	x.member_gender = req.body.member_gender;
	x.member_department = req.body.member_department;
	x.member_year = req.body.member_year;
	x.member_address = req.body.member_address;
	x.member_position = "Non-Member"
	x.save(function(err){
		if(err){
			console.log(err);
			return;
		}
		else{
			req.flash('success','MemberShip form Submitted.');
			req.flash('danger','You must pay certain amount of money to actually be a member.');
			res.redirect('/form/membership/');
		}
	});
});

//showing list of members
router.get('/memberList/',function(req,res){
	memberVariable.find({}, function(err, members){
		res.render('membersList',{
			members:members
		});
	});
});

//showing and editing single member information
router.get('/memberInfo/:id',ensureAdminAuthenticated("/members/memberList/"),function(req,res){
	memberVariable.findById({_id:req.params.id}, function(err, members){
		res.render('memberInfo',{
			members:members
		});
	});
});

//editing membership FORM
//updated contact submission route
router.post('/editMemberForm/:id', function(req, res){
	let x= {};
	x.member_Fname=req.body.member_Fname;
	x.member_Mname = req.body.member_Mname;
	x.member_Lname = req.body.member_Lname;
	x.member_email = req.body.member_email;
	x.member_phone = req.body.member_phone;
	x.member_DOB = req.body.member_DOB;
	x.member_blood = req.body.member_blood;
	x.member_gender = req.body.member_gender;
	x.member_department = req.body.member_department;
	x.member_year = req.body.member_year;
	x.member_address = req.body.member_address;
	x.member_position = req.body.member_position;

	let query = {_id:req.params.id}
	memberVariable.update(query, x, function(err){
		if(err){
			console.log(err);
			return;
		}
		else{
			res.redirect('/members/memberlist/');
		}
	});

});

//deleting members
router.delete('/memberInfo/:id',ensureAuthenticated,  function(req, res){
	let query = {_id:req.params.id}
	memberVariable.remove(query, function(err){
		if(err){
			console.log(err);
		}
		res.send('success');
	});
});

module.exports = router;
