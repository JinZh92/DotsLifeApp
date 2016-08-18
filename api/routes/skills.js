var models 	= require('./../models');
var router 	= require('express').Router();

//-------Users Model--------//


// get all skills
router.get('/',function(req,res){
	models.Skills.findAll()
	.then(function(skill){
		res.json({skills:skill});
	})
})

// get skills that are bound to specific userEmail
router.get('/:email', function(req, res){
	var where = {where: {userEmail: req.params.email}};
	models.Skills.findAll(where).then(function(skills){
		res.json({skills: skills});
		console.log("user's skills: ", skills);
	})
})

// create a new skill
router.post('/create',function(req,res){
	var __skill = req.body;
	models.Skills.create(__skill);
	console.log("new skill created: ", __skill);
})

// update an event based on the skill id
router.put('/update/:skillid', function(req, res){
	var where = {where: {id:req.params.skillid}};
	var __skill = req.body;
	models.Skills.find(where).then(function(skill){
		skill.updateAttributes({
			skillName: __skill.skillName,
			tokensTotal: __skill.tokensTotal,
			skillLevel: __skill.skillLevel,
			levelUpDate: __skill.levelUpDate,
		})
		__skill.id = req.params.skillid;
		res.json({
			skill: __skill
		})
	})
})

// delete event based on the id
router.get('/remove/:skillid',function(req,res){
	var where = {where:{id:req.params.skillid}};
	models.Skills.find(where).then(function(skill){
		skill.destroy();
		res.json({
			deleted:true
		});	
	});
})

module.exports = router;