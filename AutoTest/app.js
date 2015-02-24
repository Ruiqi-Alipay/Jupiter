var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');

var routes = require('./routes/index');
var reportRoutes = require('./routes/reporterIndex');

mongoose.connect('mongodb://localhost/news');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(multer({
    dest: './uploads/',
    rename: function(fieldname, filename) {
        return filename;
    },
    onFileUploadStart: function(file) {
        console.log(file.originalname + ' is starting...');
    },
    onFileUploadComplete: function(file) {
        console.log(file.originalname + ' is done');
    }
}));

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api', routes);
app.use('/reporter', express.static(path.join(__dirname, '/public')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/environment', express.static(path.join(__dirname, '/environment')));
app.use('/reporter/reports', express.static(path.join(__dirname, '/reports')));
app.use('/', express.static(path.join(__dirname, '/public')));

/* GET home page. */
app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET reporter home page. */
app.get('/reporter', function(req, res) {
  res.render('reporterIndex', { title: 'Express' });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
