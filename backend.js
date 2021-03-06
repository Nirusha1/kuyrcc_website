const express = require('express');
const passport=require('passport');
const path=require('path');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const expressValidator = require('express-validator');
const flash =  require('connect-flash');
const session = require('express-session');
const config=require('./config/database');
const bcrypt=require('bcryptjs');
//for email verification
const nodemailer = require('nodemailer');
const moment = require('moment');


//mongoose.connect('mongodb://localhost:27017/KUYRCCdb');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//useNewUrlParser is to remove deprication warning ( can be ignored tho)
mongoose.connect("mongodb://localhost:27017/KUYRCCdb", { useNewUrlParser: true });
let db = mongoose.connection;
//this line was added
//check db connection
db.once('open', function(){
	console.log('connected to mongoDB');
});

//check for db errors
db.on('error', function(err){
	console.log(err);
});

//init backend
const backend=express();

//load view engine
backend.set('views', path.join(__dirname, 'views'));
backend.set('view engine','pug');
//defining path to img folder
backend.use(express.static('img'));
backend.use(express.static(__dirname + "/public"));
backend.use('/scripts', express.static(__dirname + '/path/to/scripts'));
//backend.use(express.static(path.join(__dirname,'nameOfFile')));

//Bring in models
let dbvariable = require('./models/users');
let eventVariable = require('./models/events');
let contactVariable = require('./models/contacts');
let questionVariable = require('./models/questions');
let commentVariable = require('./models/commentEvent');
let volunteerVariable=require('./models/volunteers');
let membersVariable = require('./models/memberSchema');
//passport config
require('./config/passport')(passport);

//express Session middle Middleware
backend.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));

//passport middleware
backend.use(passport.initialize());
backend.use(passport.session());

//express Message  Middlewar
backend.use(require('connect-flash')());
backend.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express validator Middlewar
backend.use(expressValidator());

//Body parser Middleware
// parse application/x-www-form-urlencoded
backend.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
backend.use(bodyParser.json())

//setting global variables
backend.use(function(req,res,next){
		res.locals.usersGlobal = req.session.users ;
		next();
});

//Login Route
backend.get('/login', function(req, res){
			res.render('login');
			console.log("loginROute");
});

//Timeline
backend.get('/timeline', function(req,res){
  eventVariable.find({event_type:"Main Event"}, function(err,events_main){
    if(err){
      console.log(err);
    }else{
			console.log(events_main)
      res.render('timeline',{
        title:'Event main Lists',
        events_main: events_main
      });
    }
  })
})

//getting single user information
backend.get("/users/detail/:id",function(req,res){
			dbvariable.findById(req.params.id,function(err,users){
				res.render('user',{
					title:"Users Details",
					users:users
				});
			});
	});

//Login Process
backend.post('/LogIn', function(req,res,next){
	passport.authenticate('local',{
		successRedirect:'/frontend',
		successFlash:true,
		failureRedirect:'/frontend',
		failureFlash:true
	})(req, res, next);
});

//logout route
backend.get('/logout',function(req,res){
	req.logout();
	req.flash('success','You are logged out');
	res.redirect('/frontend');
});


//setting global user variable for all url
backend.get('*', function(req,res,next){
	res.locals.usersGlobal=req.user || null;
	eventVariable.find({},function(err,events){
	res.locals.globalEvents = events;
	});
	if(!req.user){
		console.log('Express session is not started');
		res.locals.globalMember = false
	}
	else{
		console.log('Express session is started');
		membersVariable.find({member_email:req.user.email},function(err,member){
			if (member.length == 0){
				res.locals.globalMember = false
			}else{
			res.locals.globalMember = member;}
			console.log(member);
		});
	}
	next();
});

//home route
backend.get('/', function(req, res){
				res.render('frontend',{
				title:'KUYRCC'
	});
});
//FrontEnd page route
backend.get('/frontend', function(req, res){
		eventVariable.find({}, function(err, events){
			if(err){
				console.log(err);
			}
			else{
				res.render('frontend',{
					title:'FrontEnd',
					events: events
				});
			}
		});
});

//add route
backend.get('/registerPage/', function(req, res){
		currentDate = moment().format('MM/DD/YYYY');
		//deleting the user from db if the user dont verify the account within a day
		dbvariable.deleteMany({deleteDate:{$lte:currentDate}},function(err,deletedUser){
					if(err){
						console.log(err);
						}
						res.render('register',{
							title:'Register'
						});
					});
});
//adding membership form to routes
backend.get('/form/membership',function(req,res){
	if (req.user){
		membersVariable.find({member_email:req.user.email},function(err,member){
			console.log(member);
			if (member.length==0){
				member = 0
			}
		res.render('membershipForm',{
			member:member
		});
		});
	}else{
				res.render('membershipForm',{
					member: 0
				});
	}

});

backend.get('/eventdetails', function(req,res){
	eventVariable.find({}, function(err, events){
	if(err){
		console.log(err);
		}
		else{
			res.render('single_event',{

				events: events
			});
		}
	});
});

//adding contact to routes
backend.get('/users/contacts', function(req, res,next){
	usersEmail=req.user || null;
	console.log(res.locals.usersEmail);
	if (usersEmail != null){
		email = req.user.email
	}else{
		email = ""
	}
	contactVariable.find({}, function(err, contacts){
		if(err){
			console.log(err);
		}
		else{
			res.render('contacts',{
				title:'All Contacts',
				contacts: contacts,
				email:email
			});
		}
	});
	next()
});

//for list of events
backend.get('/eventList', function(req, res){
	//eventVariable.find({} , function(err, events){
		eventVariable.find( {$or: [{event_type:"Main Event"}, {event_type:"Small Event"}]} , function(err, events){
			if(err){
				console.log(err);
			}else{
				res.render('eventList',{
					title:'Event Lists',
					events: events
				});
			}
		});
	});

//for list of events for members
backend.get('/firstAidTips/', function(req, res){
		eventVariable.find({event_type:"First Aid"}, function(err, events){
			if(err){
				console.log(err);
			}else{
				res.render('FirstAids',{
					title:'Event Lists',
					events: events
				});
			}
		});
	});

//for list of events for members
backend.get('/memberEvents/', function(req, res){
		eventVariable.find({event_type:"Meetings"}, function(err, events){
			if(err){
				console.log(err);
			}else{
				res.render('eventsForMembers',{
					title:'Event Lists',
					events: events
				});
			}
		});
	});

//for checking if users are registered in database or not route
backend.get('/checklist', function(req, res){
		dbvariable.find({}, function(err, users){
			if(err){
				console.log(err);
			}else{
				res.render('lists',{
					title:'Lists',
					users: users
				});
			}
		});
	});

//verifying user
backend.get('/:nameParam/Verify/:randNo/',function(req,res){
	res.render('verifyUser',{
		title: 'Verify Your Account',
		nameVerification: req.params.nameParam,
		randNoVerification: req.params.randNo
	});
});

backend.post('/:nameParam/Verify/:randNoParam',function(req,res){
	let x= {};
	x.user_auth=true;
	let query = {name:req.params.nameParam,pass:req.randNoParam}
	dbvariable.update(query, x, function(err){
		if(err){
			console.log(err);
			return;
		}
		else{
			req.flash('success','You have been Registered Successfully.')
			res.redirect('/frontend');
		}
	});
});

//function to generate random number for user verification
function randomNumber(low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}
//add registration route
backend.post('/registerPage/', function(req, res){
	let currentDate = moment().format('MM/DD/YYYY')
	const name=req.body.RegName;
	const email=req.body.RegEmail;
	const pwd=req.body.RegPassword;
	const conpwd=req.body.RegCPassword;
	const random_number= randomNumber(1000000,9000000);
	req.checkBody('RegName','UserName is required').notEmpty();
	req.checkBody('RegPassword')
		    .not().isIn(['123', 'password', 'god']).withMessage('Do not use a common word as the password')
		    .isLength({ min: 5 }).withMessage('Password must be at least 5 char long and contain number').matches(/\d/);
	req.checkBody('RegEmail','Email is required').notEmpty();
	req.checkBody('RegEmail','Email is not valid').isEmail();
	req.checkBody('RegPassword','Password is required').notEmpty();
	req.checkBody('RegCPassword','Passwords do not match').equals(req.body.RegPassword);

	let errors = req.validationErrors();
	if(errors){
		res.render('register',{
			errors:errors
		});
	}else{
			let x= new dbvariable({
				name:name,
				email:email,
				pwd:pwd,
				conpwd:conpwd,
				user_auth:false,
				random_number:random_number,
				deleteDate: moment(currentDate).add(1,"days").format('MM/DD/YYYY'),
				position: "Non-member"
			});

			bcrypt.genSalt(10,function(err,salt){
				bcrypt.hash(x.pwd,salt,function(err, hash){
					if(err){
						console.log(err);
					}
					x.pwd=hash;
					x.save(function(err){
						if(err){
							req.flash('danger','This Email is already used. Choose Another Valid email');
							res.redirect('/registerPage/');
						}
						else{
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
							    to: email, // email is taken from FORM
							    subject: 'Welcome to KUYRCC site',
							    text: 'click on the link to verify this email. http://localhost:3000/'+name+'/Verify/'+ random_number
							}

							transporter.sendMail(mailOptions, function (err, res) {
							    if(err){
							        console.log('User Created but Mail not sent');
							    } else {
							    		console.log('Email has been Sent');
							    }
							});
								req.flash('success','Email Has Been Sent to your account for verification');
								res.redirect('/registerPage/');
									}
					});
				});
			});
	}
});

//login Access Control
global.ensureAuthenticated= function(req, res, next){
	if (req.isAuthenticated()){
    if (req.user.user_auth){
      return next();
    }else{
      req.flash('danger','Your Account is not Verified');
      res.redirect('/frontend');
    }
	}
	else{
		req.flash('danger', 'Please Login');
		res.redirect('/frontend');
	}
}


//admin Access Control
global.ensureAdminAuthenticated= function(redirectTo){
		return function(req, res, next){
		if (req.isAuthenticated()){
		membersVariable.find({member_email:req.user.email},function(err,member){ //search for member
			if(member.length==0){ //if user is not member
				req.flash('danger','Your Account is not Verified Member. This is for Admin Access');
				res.redirect(redirectTo);
			}else{
				if (member[0].member_position == 'Admin') //if the user is admin
					return next();
				else{ //if user is a member but not admin
					req.flash('danger','Only Admin could access this');
					res.redirect(redirectTo);}}
			});
		}else{ //if user hasnt login
				req.flash('danger', 'Please Login');
				res.redirect(redirectTo);}
	}
}

//admin Access Control
global.ensureLoginAuthenticated= function(redirectTo){
		return function(req, res, next){
			console.log(req.user);
			console.log(req.user.user_auth);
		if (req.isAuthenticated()){
		membersVariable.find({member_email:req.user.email},function(err,member){ //search for member
			if(member.length==0){ //if user is not member
				if (req.user){
					if (req.user.user_auth == true){
						return next();}
				}
				req.flash('danger','Your Account is not verified');
				res.redirect(redirectTo);
			}else{
				if (member[0].member_position == 'Member' ) //if the user is admin or board
					return next();
				if (member[0].member_position == 'Board Member' ) //if the user is admin or board
					return next();
				if (member[0].member_position == 'Admin' ) //if the user is admin or board
					return next();
				else{ //if user is a member but not admin
					req.flash('danger','Your Account is not verified');
					res.redirect(redirectTo);}}
			});
		}else{ //if user hasnt login
				req.flash('danger', 'Please Login');
				res.redirect(redirectTo);}
	}
}
//admin Access Control
global.ensureBoardAuthenticated= function(redirectTo){
		return function(req, res, next){
		if (req.isAuthenticated()){
		membersVariable.find({member_email:req.user.email},function(err,member){ //search for member
			if(member.length==0){ //if user is not member
				req.flash('danger','Your Account is not Verified Member. This is for Admin Access');
				res.redirect(redirectTo);
			}else{
				if (member[0].member_position == 'Board Member' ) //if the user is admin or board
					return next();
				if (member[0].member_position == 'Admin' ) //if the user is admin or board
					return next();
				else{ //if user is a member but not admin
					req.flash('danger','Only Admin could access this');
					res.redirect(redirectTo);}}
			});
		}else{ //if user hasnt login
				req.flash('danger', 'Please Login');
				res.redirect(redirectTo);}
	}
}



//Route Files
let events = require('./routes/events');
let contacts = require('./routes/contacts');
let commentsReplies = require('./routes/commentsReplies');
let volunteers=require('./routes/volunteers');
let members=require('./routes/memberShip');
//let homeRoutes=require('./routes/homeRoutes');
//backend.use('/home/',homeRoutes);
backend.use('/users/eventList',events);
backend.use('/users/contacts', contacts);
backend.use('/users/eventList/comment/',commentsReplies);
backend.use('/users/volunteers',volunteers);
backend.use('/members/',members);

backend.locals.moment=require('moment');

//to start server
backend.listen(3000,function(){
	console.log('Server started on port 3000...');
});
