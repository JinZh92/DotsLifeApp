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

