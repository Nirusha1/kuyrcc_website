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


//mongoose.connect('mongodb://localhost:27017/KUYRCCdb');
mongoose.connect(config.database);
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
		console.log('from backend.use');
		console.log(res.locals.usersGlobal);
		next();
});

//Login Route
backend.get('/login', function(req, res){
			res.render('login');
			console.log("loginROute");
});


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
		failureRedirect:'/checklist',
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
	next();
	if(!req.user){
		console.log('Express session is not started');
	}
	else{
		console.log('Express session is started');
	}
});

//home route
backend.get('/', function(req, res){
				res.render('index',{
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
backend.get('/registerPage', function(req, res){
	res.render('register',{
		title:'Register'
	});
});
//adding membership form to routes
backend.get('/form/membership',function(req,res){
	res.render('membershipForm');
});

//adding contact to routes
backend.get('/users/contacts', function(req, res){
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
backend.post('/users/contacts',function(req,res){
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
				x.question_UserName= req.user.name;
				x.question_email= req.user.email;
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

/*
//add login route
backend.post('/:id', function(req, res){
	const email=req.body.LoginEmail;
	const pwd=req.body.LoginPassword;
	console.log("login process");
	req.checkBody('LoginEmail','Email is required').notEmpty();
	req.checkBody('LoginEmail','Email is not valid').isEmail();
	req.checkBody('LoginPassword','Password is required').notEmpty();
	req.checkBody('LoginPassword','wrong password').equals(req.body.LoginPassword);
	let errors = req.validationErrors();
	if(errors){
		res.render('frontend',{
			errors:errors
		});
	}else{
		req.flash('success','You are logged in');
		dbvariable.findUserByEmail(email,function(err,users){
			res.render('frontend',{
				title:"Users Found",
				users:users,
			});
		});
		// res.locals.userGolbal = req.users;
		// console.log(req.users);
	}
});
*/
//add registration route
backend.post('/:id', function(req, res){
	const name=req.body.RegName;
	const email=req.body.RegEmail;
	const pwd=req.body.RegPassword;
	const conpwd=req.body.RegCPassword;
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
		res.render('frontend',{
			errors:errors
		});
	}else{
			let x= new dbvariable({
				name:name,
				email:email,
				pwd:pwd,
				conpwd:conpwd

			});

			bcrypt.genSalt(10,function(err,salt){
				bcrypt.hash(x.pwd,salt,function(err, hash){
					if(err){
						console.log(err);
					}
					x.pwd=hash;
					x.save(function(err){
						if(err){
							console.log(err);
							return;
						}
						else{
							req.flash('success','You  are now registered and can now log in');
							res.redirect('frontend');
						}
					});
				});
			});
	}
});

//this is just to itest
backend.get('/test',function(req,res){
	res.render('test');
})

//Route Files
let events = require('./routes/events');
let contacts = require('./routes/contacts');
backend.use('/users/eventList',events);
backend.use('/users/contacts', contacts);

//to start server
backend.listen(3000,function(){
	console.log('Server started on port 3000...');
});
