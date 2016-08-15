var express = require('express');
var app = express();

app.use(express.static(__dirname + './../app/'));

app.listen(8080, function(){
	console.log('Server Started on http://localhost:8080');
	console.log('Press CTRL + C to stop server');
})