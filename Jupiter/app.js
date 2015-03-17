var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var root = require('./routes/rootIndex')
var autoTest = require('../AutoTest/app.js');
var adkEditor = require('../SDKEditor/app.js');
var autoPack = require('../AutoPack/app.js').app;
var feedbackCenter = require('../FeedbackCenter/app.js');
var yoNote = require('../YoNote/app.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', root);
app.use('/autotest', autoTest);
app.use('/sdkeditor', adkEditor);
app.use('/autopack', autoPack);
app.use('/feedback', feedbackCenter);
app.use('/note', yoNote);
app.use('/bower_components',  express.static(path.join(__dirname, '/bower_components')));
app.use('/environment', express.static(path.join(__dirname, '..', 'AutoTest', 'environment')));

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

if (require.main === module) {
    app.listen(80, function(){
        console.info('Express server listening on port ' + 80);
    });
} else {
    module.exports = app;
}
