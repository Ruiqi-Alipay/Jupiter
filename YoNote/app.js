var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

mongoose.connect('mongodb://localhost/yonote');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api', require(path.join(__dirname, 'server', 'api.js')));
app.use('/', express.static(path.join(__dirname, 'webapp')));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'webapp', 'app', 'index.html'));
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

if (require.main === module) {
    app.listen(80, function(){
        console.info('Yo-Note server listening on port ' + 80);
    });
} else {
    module.exports = app;
}