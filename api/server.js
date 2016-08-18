var express = require('express'),
	models = require('./models'),
	bodyParser	= require('body-parser'),
	app = express(),
	port = 8080;

app.use(express.static(__dirname + './../app/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Middleware
var authentication = require('./middleware/auth')

//Routes
var auth_routes = require('./routes/auth');
var user_routes = require('./routes/users');
var event_routes = require('./routes/events');
var skill_routes = require('./routes/skills');



//End points
app.use('/api/auth',auth_routes);
app.use('/api/users',authentication,user_routes);
app.use('/api/events',authentication,event_routes);
app.use('/api/skills',authentication,skill_routes);


models.sequelize.sync().then(function(){
	app.listen(port, function(){
		console.log('Server Started on http://localhost:' + port);
		console.log('Press CTRL + C to stop server');
	})
})



// var user = {
// 	userEmail: 'i@i.com',
// 	userPswd: '111',
//     userFullName: 'III',
//     userBirthday: '1900-01-01',
//     currEvents: [1, 3, 2]
// }

// models.Users.create(user).then(function(user){
// 	console.log('User created: ' + user);
// })

// var where = {where:{userEmail:'i@i.com'}};
// models.Users.find(where).then(function(user){
// 		//findall returns an array of objects
// 		console.log(user);
// })
