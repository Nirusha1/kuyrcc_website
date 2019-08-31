const express = require('express');
const router =  express.Router();

//Bring in models
let memberVariable = require('../models/memberSchema');
let dbvariable = require('../models/users');

let membersVariable = require('../models/memberSchema');

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

	req.checkBody('member_Fname','First name is required').notEmpty();
	req.checkBody('member_Lname','Last name is required').notEmpty();
	req.checkBody('member_email','Email is required').isEmail();
	req.checkBody('member_phone','Phone is required').notEmpty();
	req.checkBody('member_DOB','DOB is required').notEmpty();
	req.checkBody('member_address','Address is required').notEmpty();

	let errors = req.validationErrors();
	if(errors){
			if (req.user){
				membersVariable.find({member_email:req.user.email},function(err,member){
					console.log(member);
					if (member.length==0){
						member = 0
					}
				res.render('membershipForm',{
					member:member,
					errors:errors
				});
				});
			}else{
						res.render('membershipForm',{
							member: 0,
							errors:errors
						});
			}
	}else{
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
	}

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

	req.checkBody('member_Fname','First name is required').notEmpty();
	req.checkBody('member_Lname','Last name is required').notEmpty();
	req.checkBody('member_email','Email is required').isEmail();
	req.checkBody('member_phone','Phone is required').notEmpty();
	req.checkBody('member_DOB','DOB is required').notEmpty();
	req.checkBody('member_address','Address is required').notEmpty();

	let errors = req.validationErrors();
	if(errors){
		memberVariable.findById({_id:req.params.id}, function(err, members){
			res.render('memberInfo',{
				members:members,
				errors:errors
			});
		});
	}else{

		let query = {_id:req.params.id}
		memberVariable.update(query, x, function(err){
			if(err){
				console.log(err);
				return;
			}
			else{
				let y = {};
				y.position = req.body.member_position;
				dbvariable.update({email:req.body.member_email},y,function(err){
					if(err){
						console.log(err);
						return;
					}
				});
				res.redirect('/members/memberlist/');
			}

	});
}

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
