var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');
var xlsx = require('xlsx');
var exec = require('child_process').exec;
var fs = require('fs');

var translate = function (array, manualInput, callback) {
    var finished = 0;
    var finishedmap = {};

    for (var i = 0; i < array.length; i+=10) {
        var j = i;
        var params = 'q=';
        for (; j < i + 10; j++) {
            if (j >= array.length) {
                break;
            }

            params += (array[j].title + '%0A' + array[j].content + '%0A');
        }
        params = params.slice(0, params.length - 3);

        request.post({
            url:'http://openapi.baidu.com/public/2.0/bmt/translate',
            form: 'client_id=kaGTr93fmLAhwGxibsbiFd7y&' + params + '&from=en&to=zh'
            }, function(err, httpResponse, body){
                finished++;
                if (body) {
                    body = JSON.parse(body);
                    if (body.trans_result) {
                        for (var arrayIndex = 0; arrayIndex < array.length; arrayIndex++) {
                            if (arrayIndex in finishedmap) {
                                continue;
                            }

                            var item = array[arrayIndex];
                            var titleTranslate = false;
                            var contentTranslate = false;
                            for (var index in body.trans_result) {
                                var result = body.trans_result[index];

                                if (!titleTranslate && item.title == result.src) {
                                    titleTranslate = true;
                                    if (item.title != result.dst) {
                                        item.title += (' 【' + result.dst + '】');
                                    }
                                }
                                if (!contentTranslate && item.content == result.src) {
                                    contentTranslate = true;
                                    var needTranslate = item.content != result.dst;
                                    item.content = (manualInput ? '【WEB手动导入】' : '【AE反馈批量导入】') + String.fromCharCode(13) + item.content;
                                    if (needTranslate) {
                                        item.content += (String.fromCharCode(13) + '【' + result.dst + '】');
                                    }
                                }

                                if (titleTranslate && contentTranslate) {
                                    finishedmap[index] = result;
                                    break;
                                }
                            }
                        }
                    }
                }

                array.forEach(function (item) {
                    if (item.title.length > 288) {
                        item.title = item.title.slice(0, 288);
                    }
                    if (item.content.length > 288) {
                        item.content = item.content.slice(0, 288);
                    }
                    if (item.extra && item.extra.length > 288) {
                        item.extra = item.extra.slice(0, 288);
                    }
                });

                if (finished >= array.length / 10) {
                    callback(array);
                }
            }
        );
    }
}

var saveToMPop = function (array, manualInput, callback) {
    translate(array, manualInput, function (results) {
        var d = new Date();
        var filePath = path.join(__dirname, '..', 'libs', d.getTime() + '.json');

        fs.writeFile(filePath, JSON.stringify(results), function (err) {
            if (err) {
                return callback({
                    result: false,
                    msg: err
                });
            }

            exec('java -jar ' + path.join(__dirname, '..', 'libs', 'feedback.jar') + ' ' + filePath
                , function (error, stdout, stderr){
                console.log('Save feedback finished! ');
                if (error) console.log('error: ' + error);
                if (stderr) console.log('stderr: ' + stderr);

                console.log(stdout);

                fs.unlink(filePath);

                var result;
                var resultError;
                try {
                    result = JSON.parse(stdout.slice(stdout.indexOf('<MPOPJARRESULT>') + 15, stdout.indexOf('</MPOPJARRESULT>')));
                } catch (err) {
                    resultError = err;
                }
                
                callback({
                	msg: result ? ('创建完成：成功 ' + result.success + ' 失败 ' + result.failed) : ('System error: ' + resultError)
                });
            });
        });
    });
};

router.post('/feedback', function (req, res, next) {
	if (!req.body) return next(new Error('Request body is empty!'));

	saveToMPop([req.body], true, function (result) {
		res.json(result);
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

    fs.unlink(file.path);

	saveToMPop(feedbacks, false, function (result) {
	    res.json(result);
	});
});

module.exports = router;


