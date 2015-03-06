var express = require('express');
var app = express();
var path = require('path');
var channel = require('./routes/channel.js')

/* DB connection */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/autopack');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('DB connection success!');
});

var clientInterface = require('./routes/clientInterface');

app.use('/api', clientInterface);
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
	var http = require('http').Server(app);
	http.listen(80, function() {
	  console.log('Autopack server started! listening on port ' + 80);
	});
	channel.start(http);
} else {
	exports.start = function (http) {
		channel.start(http);
	};

    exports.app = app;
}