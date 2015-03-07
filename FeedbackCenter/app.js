var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(multer({
    dest: path.join(__dirname, 'uploads'),
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api', require('./routes/clientInterface'));
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
    app.listen(80, function(){
        console.info('Express server listening on port ' + 80);
    });
} else {
    module.exports = app;
}