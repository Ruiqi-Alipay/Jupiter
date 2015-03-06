var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');
var xlsx = require('xlsx');
var exec = require('child_process').exec;

var saveToMPop = function (array, callback) {
	var params = 'q=';
	array.forEach(function (item) {
		params += (item.title + '%0A' + item.content + '%0A');
	});
	params = params.slice(0, params.length - 3);

	request.post({
		url:'http://openapi.baidu.com/public/2.0/bmt/translate',
		form: 'client_id=kaGTr93fmLAhwGxibsbiFd7y&' + params + '&from=en&to=zh'
		}, function(err, httpResponse, body){
			if (body) {
				body = JSON.parse(body);
				if (body.trans_result) {
					array.forEach(function (item) {
						var titleTranslate, contentTranslate = false;

						for (var index in body.trans_result) {
							var result = body.trans_result[index];

							if (!titleTranslate && item.title == result.src) {
								if (item.title != result.dst) {
									item.title += (' 【' + result.dst + '】');
								}
								titleTranslate = true;
							}
							if (!contentTranslate && item.content == result.src) {
								if (item.content != result.dst) {
									item.content += (' 【' + result.dst + '】');
								}
								contentTranslate = true;
							}

							if (titleTranslate && contentTranslate) {
								break;
							}
						}
					});
				}
			}

			var args = encodeURIComponent(JSON.stringify(array));
			console.log('Address: ' + args);
			exec('java -jar ' + path.join(__dirname, '..', 'libs', 'feedback.jar') + ' ' + args
				, function (error, stdout, stderr){
				console.log('Save feedback finished! ');
				console.log('error:');
				console.log(error);
				console.log('stdout:');
				console.log(stdout);
				console.log('stderr:');
				console.log(stderr);
			});
			callback(array);
		}
	);
};

router.post('/feedback', function (req, res, next) {
	if (!req.body) return next(new Error('Request body is empty!'));

	saveToMPop([req.body], function (result) {
		res.json(result[0]);
	});
});

router.post('/upload', function (req, res, next) {
    var file = req.files.file;
    var workbook = xlsx.readFile(file.path);
    var feedbacks = [];

    for (var key in workbook.Sheets) {
        var sheet = workbook.Sheets[key];
        var index = 2;
        while (sheet['A' + index]) {
        	var subject = sheet['F' + index];
        	var content = sheet['H' + index];

        	if (!subject || !subject.v || !content || !content.v) {
        		index++;
        		continue;
        	}

        	var feedback = {
        		apptype: 'interpaysdk_android',
            	semanticCategory: 'OTHERS',
        		title: subject.v,
        		content: content.v
        	};

            var createTime = sheet['A' + index];
            if (createTime && createTime.v) {
            	feedback.commentTimeSecond = createTime.v;
            }
            var memberId = sheet['C' + index];
            if (memberId && memberId.v) {
            	feedback.alipayUserId = memberId.v;
            }
            var id = sheet['G' + index];
            if (id && id.v) {
            	feedback.originRecordId = id.v;
            }

            var companyName = sheet['B' + index];
            if (companyName && companyName.v) {
            	feedback.extra = 'CompanyName: ' + companyName.v;
            }
            var country = sheet['D' + index];
            if (country && country.v) {
            	if (feedback.extra) {
            		feedback.extra += ('; Country: ' + country.v);
            	} else {
            		feedback.extra = 'Country: ' + country.v;
            	}
            }
            var email = sheet['E' + index];
            if (email && email.v) {
            	if (feedback.extra) {
            		feedback.extra += ('; Email: ' + email.v);
            	} else {
            		feedback.extra = 'Email: ' + email.v;
            	}
            }

            feedbacks.push(feedback);
            index++;
        }
    }

	saveToMPop([req.body], function (result) {
	    res.json({
	    	count: result.length
	    });
	});
});

module.exports = router;


