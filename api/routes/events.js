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
	models.Events.create(__event);
	console.log("new event created: ", __event);

})



// // get individual user object from email
// router.get('/:email', function(req,res){
// 	var where = {where:{userEmail: req.params.email}};
// 	models.Users.find(where).then(function(user){
// 		res.json({user:user})
// 	});
// })

// // delete accounts via this get request based on userID
// router.get('/remove/:userID',function(req,res){
// 	var where = {where:{id:req.params.userID}};
// 	models.Users.find(where).then(function(user){
// 		user.destroy();
// 		res.json({
// 			deleted:true
// 		});	
// 	});
// })





module.exports = router;