var express = require('express');
var router = express.Router();
var request = require('request');

router.post('/feedback', function (req, res, next) {
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
			
			body.trans_result.forEach(function (item) {
				for (var key in req.body) {
					if (req.body[key] == item.src) {
						req.body[key] = item.dst;
						break;
					}
				}
			});

			res.json(req.body);
		}
	);
});

module.exports = router;