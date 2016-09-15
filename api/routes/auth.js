var models 	= require('./../models');
var bcrypt	= require('bcrypt');
var jwt		= require('jsonwebtoken');
var router 	= require('express').Router();


//register a new user
router.post('/register',function(req,res){
	var __user = req.body;
	console.log("req.body is: ", __user);
	var where = {where:{userEmail:__user.userEmail}};
	console.log("where for new register:", where);
	// models.Users.find(where)
	// encryption
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(__user.userPswd, salt, function(err, hash) {
	        // Store hash in your password DB.
	        if(!err){
	        	__user.userPswd = hash;
		        	models.Users.create(__user)
		        	.then(function(user){
			        	//remove password from response

			        	user.password ='';
			        	res.json({user:user,msg:'Account Created'});
		        	}, function(err){
		        		res.status(403)
		        			.json({err:'User email already exists.'})
		        	})

	        }
	    });
	});
});

router.post('/authenticate',function(req,res){
	console.log('Authentication Endpoint');
	var __user = req.body;

	var where = {where:{userEmail:__user.userEmail}};

	models.Users.find(where)
	.then(function(user){
		console.log("User:", user);
		if (user == null){
			res.status(403)
				.json({err:'User does not exist'})
		} else {
			// compare encrypted keys
			bcrypt.compare(__user.userPswd, user.userPswd, function(err, result) {
			    // res == true 
			    if(result==true){
			    	user.userPswd = '';
			    	delete user.userPswd;
			    	var user_obj = {
			    		userEmail:user.userEmail
			    	};

			    	// creating the token based on the current user_obj
					var token = jwt.sign(user_obj,'brainstationkey');

					var user_details = {
						token:token,
						userEmail:user.userEmail,
						msg: 'Logged in successful!'
					}
					// Set the response's header 'authentication' to be token
					res.set('authentication',token);
			    	res.json(user_details)
			    }
			    else{
			    	res.status(403)
			    		.json({err:'unauhthorized'});
			    }
			});
		}
	})

})

module.exports = router;