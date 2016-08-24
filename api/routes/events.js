var models 	= require('./../models');
var router 	= require('express').Router();

//-------Users Model--------//


// get all events
router.get('/',function(req,res){
	models.Events.findAll()
	.then(function(event){
		res.json({events:event});
	})
})

// get events that are bound to specific userEmail
router.get('/:email', function(req, res){
	var where = {where: {userEmail: req.params.email}};
	models.Events.findAll(where).then(function(events){
		res.json({events: events});
		console.log("user's events: ", events);
	})
})

// create a new event
router.post('/create',function(req,res){
	var __event = req.body;
	models.Events.create(__event).then(function(event){
		res.json({created: true})
	});
	console.log("new event created: ", __event);
})

// update an event
router.put('/update/:eventid', function(req, res){
	var where = {where: {id:req.params.eventid}};
	var __event = req.body;
	models.Events.find(where).then(function(event){
		event.updateAttributes({
			eventTitle: __event.eventTitle,
			eventDescription: __event.eventDescription,
			eventStart: __event.eventStart,
			eventExpectedEnd: __event.eventExpectedEnd,
			eventActualEnd: __event.eventActualEnd,
			eventHasSkills: __event.eventHasSkills,
			eventStatus: __event.eventStatus
		})
		__event.id = req.params.eventid;
		res.json({
			event: __event
		})
	})
})

// delete event based on the id
router.get('/remove/:eventid',function(req,res){
	var where = {where:{id:req.params.eventid}};
	models.Events.find(where).then(function(event){
		event.destroy();
		res.json({
			deleted:true
		});	
	});
})

module.exports = router;