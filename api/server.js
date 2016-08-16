var express = require('express'),
	app = express(),
	port = 8080;

app.use(express.static(__dirname + './../app/'));

// middleware
var authentication = require('./middleware/auth')


app.listen(port, function(){
	console.log('Server Started on http://localhost:' + port);
	console.log('Press CTRL + C to stop server');
})