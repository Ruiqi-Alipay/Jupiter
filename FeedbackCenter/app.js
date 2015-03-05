var express = require('express');
var app = express();
var path = require('path');

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