var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');
var exec = require('child_process').exec;

router.post('/feedback', function (req, res, next) {
	if (!req.body) return next(new Error('Request body is empty!'));
	
	var split = '%0A';
	var params = 'q='
	for (var key in req.body) {
		params += (req.body[key] + split);
	}
	params = params.slice(0, params.length - 3);

	request.post({url:'http://openapi.baidu.com/public/2.0/bmt/translate', form: 'client_id=kaGTr93fmLAhwGxibsbiFd7y&' + params + '&from=auto&to=zh'},
		function(err, httpResponse, body){
			if (err) return next(err);

			body = JSON.parse(body);
			
			if (body.trans_result) {
				body.trans_result.forEach(function (item) {
					for (var key in req.body) {
						if (req.body[key] == item.src) {
							req.body[key] = item.dst;
							break;
						}
					}
				});
			}

			var params = ' ' + req.body.title + ' ' + req.body.content;
			console.log('params: ' + params);

			exec('java -Dfile.encoding=UTF-8 -jar ' + path.join(__dirname, '..', 'libs', 'feedback.jar') + params,
				function (error, stdout, stderr){
				console.log('stdout:');
				console.log(stdout);
			});

			res.json(req.body);
		}
	);
});

module.exports = router;