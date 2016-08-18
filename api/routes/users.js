var models 	= require('./../models');
var router 	= require('express').Router();

//-------Users Model--------//

// get all users
router.get('/',function(req,res){
	models.Users.findAll()
	.then(function(users){
		res.json({users:users});
	})
})

// get individual user object from email
router.get('/:email', function(req,res){
	var where = {where:{userEmail: req.params.email}};
	models.Users.find(where).then(function(user){
		res.json({user:user})
	});
})

// delete accounts via this get request based on userID
router.get('/remove/:userID',function(req,res){
	var where = {where:{id:req.params.userID}};
	models.Users.find(where).then(function(user){
		user.destroy();
		res.json({
			deleted:true
		});	
	});
})

// post




module.exports = router;