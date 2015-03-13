var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');
var xlsx = require('xlsx');
var exec = require('child_process').exec;
var fs = require('fs');
var q = require('q');

var azureClientID = "ClientFeedbackTranslator2";
var azureClientSecret = "u0zrEdaIxuSwpEWTb+k5dd5ULUC5hidRj/1UqFpko4k=";
var azureTranslatorURI = "https://datamarket.accesscontrol.windows.net/v2/OAuth2-13";
var azureRequestDetails = "grant_type=client_credentials&client_id="
                            + encodeURIComponent(azureClientID) + "&client_secret="
                            + encodeURIComponent(azureClientSecret) + "&scope=http://api.microsofttranslator.com";

var getPrefixContent = function (inputTpye) {
    switch(inputTpye) {
        case 'manual': return '【WEB手动导入】';
        case 'google': return '【Google Play爬虫导入】';
        case 'batch': return '【AE反馈批量导入】';
    }
};

var azureTranslate = function (array, inputTpye, callback) {
    request.post({
        url: azureTranslatorURI,
        headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': azureRequestDetails.length
        },
        body: azureRequestDetails
        }, function(err, httpResponse, body){
            var contentPrefix = getPrefixContent(inputTpye);
            var response = JSON.parse(body);
            var to = "zh-CHS";

            var penndingForTranslation = {};
            array.forEach(function (item) {
                penndingForTranslation[item.title] = false;
                penndingForTranslation[item.content] = false;
            });

            var defer = q.defer();
            var taskCounter = 0;

            for (var key in penndingForTranslation) {
                var uri = "http://api.microsofttranslator.com/v2/Http.svc/Translate?text=" + encodeURIComponent(key) + "&to=" + to;
                var authToken = "Bearer" + " " + response.access_token;

                taskCounter++;
                (function () {
                    var original = key;
                    request.get({
                        url: uri,
                        headers: {
                              'Authorization': authToken
                        }}, function (err, httpResponse, body) {
                            taskCounter--;

                            var translated = body.slice(body.indexOf('/">') + 3, body.lastIndexOf('</string>'));

                            array.forEach(function (item) {
                                if (item.title == original) {
                                    item.title = contentPrefix + '【' + translated + '】' + original;
                                }
                                if (item.content == original) {
                                    item.content = contentPrefix + '【' + translated + '】' + original;
                                }
                            });

                            if (taskCounter == 0) {
                                defer.resolve(array);
                            }
                        }
                    );
                })();
            }

            defer.promise.then(function (results) {
                callback(results);
            }).catch(function (err) {
                callback([]);
            });
        }
    );
};

var baiduTranslate = function (array, inputTpye, callback) {
    var finished = 0;
    var finishedmap = {};
    var prefixContent = getPrefixContent(inputTpye);

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
            form: 'client_id=kaGTr93fmLAhwGxibsbiFd7y&' + params + '&from=auto&to=zh'
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
                                        item.title = '【' + result.dst + '】' + item.title;
                                    }
                                }
                                if (!contentTranslate && item.content == result.src) {
                                    contentTranslate = true;
                                    if (item.content != result.dst) {
                                        item.content = prefixContent
                                                + String.fromCharCode(13) + '【' + result.dst + '】'
                                                + String.fromCharCode(13) + item.content;
                                    } else {
                                        item.content = prefixContent
                                                + String.fromCharCode(13) + item.content;
                                    }
                                }

                                if (titleTranslate && contentTranslate) {
                                    finishedmap[arrayIndex] = item;
                                    break;
                                }
                            }
                        }
                    }
                }

                if (finished >= array.length / 10) {
                    callback(array);
                }
            }
        );
    }
}

var paymentRelated = function (item) {
    var title = item.title.toLowerCase();
    var content = item.content.toLowerCase();
    if (title.indexOf('pay') > 0 || title.indexOf('支付') > 0 || title.indexOf('款') > 0 || title.indexOf('收银') > 0
        || content.indexOf('pay') > 0 || content.indexOf('支付') > 0 || content.indexOf('款') > 0 || title.indexOf('收银') > 0) {
        return true
    } else {
        return false;
    }
}

var saveToMPop = function (array, inputTpye, callback) {
    azureTranslate(array, inputTpye, function (results) {
        var d = new Date();
        var filePath = path.join(__dirname, '..', 'libs', d.getTime() + '.json');

        var paymentFeedbacks = [];
        results.forEach(function (item) {
            if (paymentRelated(item)) {
                paymentFeedbacks.push(item);
            }
        });

        if (paymentFeedbacks.length == 0) {
            return callback({
                msg: '平台只接受内容或翻译后内容包含 "支付"，"款"，"收银"， 或 "pay" 的反馈'
            });
        }

        fs.writeFile(filePath, JSON.stringify(paymentFeedbacks), function (err) {
            if (err) {
                return callback({msg: err});
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

    var manualInput = !(req.body instanceof Array);
    var feedbacks = manualInput ? [req.body] : req.body;
    var formatedFeedbacks = [];
    feedbacks.forEach(function(feedback) {
        if (feedback.title && feedback.content && feedback.apptype && feedback.semanticCategory) {
            if (feedback.title.length > 288) {
                feedback.title = feedback.title.slice(0, 288);
            }
            if (feedback.content.length > 288) {
                feedback.content = feedback.content.slice(0, 288);
            }
            formatedFeedbacks.push(feedback);
        }
    });

    if (formatedFeedbacks.length == 0) {
        return res.json({
            msg: '数据非法：反馈数据需包含 title, content, apptype和semanticCategory字段'
        });
    }

	saveToMPop(formatedFeedbacks, manualInput ? 'manual' : 'google', function (result) {
		res.json(result);
	});
});

router.post('/upload', function (req, res, next) {
    try {
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
                subject = subject.v;
                content = content.v;

                if (content.indexOf('Contact Name: ') == 0) {
                    content = content.slice(content.indexOf(' ', 15) + 1);
                }

                var versionIndex2 = content.indexOf('Version:');
                var deviceIndex2 = content.indexOf('Device:');
                var osIndex2 = content.indexOf('OS:');
                var npsIndex2 = content.indexOf('NPS:');

                var deviceIndex = content.indexOf('Device :');
                var osIndex = content.indexOf('OS :');
                var engineIndex = content.indexOf('Engine :');
                var bowserIndex = content.indexOf('Browser:');
                var appInfo;

                if (bowserIndex > 0 &&
                    engineIndex > bowserIndex &&
                    osIndex > engineIndex &&
                    deviceIndex > osIndex) {
                    var bowser = content.slice(bowserIndex + 8, engineIndex);
                    var engine = content.slice(engineIndex + 8, osIndex);
                    var os = content.slice(osIndex + 4, deviceIndex);
                    var lastPart = content.slice(deviceIndex + 8).split(' ');
                    var device = lastPart[0];
                    var etao = '';
                    if (lastPart.length > 1) {
                        etao = lastPart[1];
                    }

                    content = content.slice(0, bowserIndex);
                    appInfo = ':' + os + ':' + device + '::::::' + bowser + ' ' + engine + '::' + etao;
                } else if (versionIndex2 > 0 &&
                            deviceIndex2 > versionIndex2 &&
                            osIndex2 > deviceIndex2 &&
                            npsIndex2 > osIndex2) {
                    var version = content.slice(versionIndex2 + 8, deviceIndex2);
                    var device = content.slice(deviceIndex2 + 7, osIndex2);
                    var os = content.slice(osIndex2 + 3, npsIndex2);
                    var nps = content.slice(npsIndex2 + 4);

                    content = content.slice(0, versionIndex2);
                    appInfo = version + ':' + os + ':' + device + '::::::::';
                }

                if (subject.length > 288) {
                    subject = subject.slice(0, 288);
                }
                if (content.length > 288) {
                    content = content.slice(0, 288);
                }

                var feedback = {
                    apptype: 'interpaysdk_android',
                    semanticCategory: 'OTHERS',
                    title: subject,
                    content: content
                };

                if (appInfo) {
                    feedback.appInfo = appInfo;
                }

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

        saveToMPop(feedbacks, 'batch', function (result) {
            res.json(result);
        });
    } catch (err) {
        var file = req.files ? req.files.file : undefined;
        if (file) {
            fs.unlink(file.path);
        }

        res.json({msg: err});
    }
});

module.exports = router;


