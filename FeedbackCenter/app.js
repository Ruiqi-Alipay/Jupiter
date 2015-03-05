var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var clientInterface = require('./routes/clientInterface');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api', clientInterface);
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