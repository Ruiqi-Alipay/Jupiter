var express = require('express'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	mongoose = require('mongoose'),
	favicon = require('serve-favicon'),
	multer = require('multer'),
	path = require('path');

mongoose.connect('mongodb://localhost/news');

var app = express();

app.use(multer({
	dest: path.join(__dirname, 'public'),
    rename: function(fieldname, filename) {
        return filename;
    }
}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', require(path.join(__dirname, 'server')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/reports', express.static(path.join(__dirname, 'reports')));
app.use('/reporter', express.static(path.join(__dirname, 'reporter')));
app.use('/', express.static(path.join(__dirname, 'web')));

if (require.main == module) {
	app.listen(80, function () {
		console.log('Automation server now listen on port: ' + 80);
	})
} else {
	module.exports = app;
}