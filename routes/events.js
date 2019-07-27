const express = require('express');
const router =  express.Router();
const multer= require('multer');
const path= require('path');
const moment = require('moment');

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
	storage: storage,
  fileFilter: function(req, file, callback){
    validateFile(file, callback);
  }
}).single('events_image');

var validateFile = function(file, cb ){
  allowedFileTypes = /jpeg|jpg|png|gif/;
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType  = allowedFileTypes.test(file.mimetype);
  if(extension && mimeType){
    return cb(null, true);
  }else{
    cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
  }
}


//users Events
//add routes for creating events and deleting not required events
router.get('/CreateEvent',ensureAuthenticated, function(req, res){
	currentDate = moment().format('MM/DD/YYYY');
	eventVariable.deleteMany({event_deleteDate:{$gte:currentDate}},function(err,deletedEvent){
				if(err){
					console.log(err);
					}
					console.log("deletedEvent");
					console.log(deletedEvent);
				});
	res.render('events',{
	title:'Events'
	});
});

//for list of events for members
router.get('/memberEvents', function(req, res){
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

//Get Single Event
router.get('/:id', function(req, res){
	eventVariable.findById(req.params.id, function(err, events){
		res.render('single_event',{
			events: events
		});
	});
});

//add event creation and submission route
router.post('/CreateEvent', function(req, res){
	upload(req, res, (err)=>{
		if(err){
      req.flash('danger', 'The selected file is not an image!!')
      res.redirect('/users/eventList/CreateEvent');
        }
    else{
      if (req.file == undefined){
        let sF= new eventVariable({
          event_UserName:req.user.name,
          event_Userid:req.user.id,
          event_name:req.body.event_name,
          event_body:req.body.event_body,
          event_location:req.body.event_location,
          event_date:req.body.event_date,
          eventVolunteerNo:req.body.eventVolunteerNo,
          event_type:req.body.event_type,
          event_image_path: null,
          event_createdDate: moment().format('MM/DD/YYYY'),
        });
        sF.save(function(error){
          if(error){
            throw error;
          }
          res.redirect('/');
        });
      }
      else{
        let fullPath = " "
        imageExists = req.body.event_imageSelected
        console.log(imageExists);
        if( imageExists == "imageExists" )
          fullPath = "uploads/" + req.file.filename;
        else
          fullPath = " "
          // try to make a image if image doest exists
        dateToDelete = parseInt(req.body.event_dateToDelete);
        var document = {
          event_UserName:req.user.name,
          event_Userid:req.user.id,
          event_name:req.body.event_name,
          event_body:req.body.event_body,
          event_location:req.body.event_location,
          event_date:req.body.event_date,
          eventVolunteerNo:req.body.eventVolunteerNo,
          event_type:req.body.event_type,
          event_image_path: fullPath,
          //to delete event after certain day
          event_createdDate: moment().format('MM/DD/YYYY'),
          //event_deleteDate: moment(this.event_date).add(dateToDelete,"days").format('MM/DD/YYYY')

        };
        let x = new eventVariable(document);
        x.save(function(error){
          if(error){
            throw error;
          }
          res.redirect('/');
        });
      }
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
