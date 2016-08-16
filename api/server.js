var express = require('express'),
	app = express(),
	port = 8080;

app.use(express.static(__dirname + './../app/'));

app.listen(port, function(){
	console.log('Server Started on http://localhost:' + port);
	console.log('Press CTRL + C to stop server');
})