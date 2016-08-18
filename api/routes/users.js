var models 	= require('./../models');
var bcrypt	= require('bcrypt');
var jwt		= require('jsonwebtoken');
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
	})
})

// change user password and generate a new encrypted password
router.put('/changePassword/:email',function(req,res){
	var __user = req.body;
	var where = {where:{userEmail:req.params.email}};

	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(__user.userPswd, salt, function(err, hash) {
	        if(!err){
	        	__user.userPswd = hash;
		        	models.Users.find(where).then(function(user){
		        		user.updateAttributes({
		        			userPswd: __user.userPswd
		        		})
			        	//remove password from response
			        	user.password ='';
			        	res.json({user:user,msg:'User password is updated!'});
		        })
	        }
	    })
	})
})

// update an individual user
router.put('/update/:email', function(req, res){
	var where = {where: {userEmail:req.params.email}};
	var __user = req.body;
	models.Users.find(where).then(function(user){
		event.updateAttributes({
			userFullName: __user.userFullName,
			userBirthday: __user.userBirthday,
			currEvents: __user.currEvents,
		})
		__user.userEmail = req.params.email;
		res.json({
			user: __user
		})
	})
})


// delete an account based on userID
router.get('/remove/:userID',function(req,res){
	var where = {where:{id:req.params.userID}};
	models.Users.find(where).then(function(user){
		user.destroy();
		res.json({
			deleted:true
		})
	})
})

module.exports = router;