var express = require('express');
var app = express();
var path = require('path');

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

module.exports = app;