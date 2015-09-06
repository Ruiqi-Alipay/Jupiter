var request = require('request');
	Q = require('q');

function callDataBankAgent (agentId, userParams) {
	var defered = Q.defer();

	request.post({
		url: 'http://databank.alibaba-inc.com/execute/executeData.htm',
		form: {
			loginName: 'tianzhong.ctz',
			dataId: agentId,
			userParam: userParams,
			isShare: '0',
			number: '1',
			version: '1.0.0'
		},
		json: true,
		timeout: 10000
	}, function (error, response, body) {
		if (body && body.success && body.runInfoIds && body.runInfoIds[0]) {
			defered.resolve(body.runInfoIds[0]);
		} else {
			defered.reject({
				error: error,
				body: body
			});
		}
	});

	return defered.promise;
}

function queryResult (runInfos, retry, callback) {
	request.post({
		url: 'http://databank.alibaba-inc.com/execute/executeDataStatus.htm',
		form: {
			runInfoId: runInfos
		},
		json: true,
		timeout: 5000
	}, function (error, response, body) {
		if (body && body.status == 'COMPLETED') {
			callback(body.result);
		} else {
			if (retry > 0) {
				setTimeout(function () {
					queryResult(runInfos, retry - 1, callback);
				}, 1000);
			} else {
				callback(undefined, {
					error: error,
					body: body
				});
			}
		}
	});
}

function getDataBankResult (runInfos) {
	var defered = Q.defer();

	queryResult(runInfos, 10, function (result, err) {
		if (result) {
			defered.resolve(result);
		} else {
			defered.reject(err);
		}
	});

	return defered.promise;
}

function createMember(userType) {
	console.log("CREATE_MEMBER");
	var derfered = Q.defer();

	var params = {
		status: 'enabled',
		envType: 'fc',
		role: 'both',
		serviceType: userType,
		stage: 'cust_add',
		database: 'fc',
	};

	callDataBankAgent('1137', JSON.stringify(params))
		.then(function (runInfoIds) {
			return getDataBankResult(runInfoIds);
		})
		.then(function (result) {
			derfered.resolve(result.loginId);
		})
		.catch(function (err) {
			derfered.reject(err);
		});

	return derfered.promise;
}

function createTUser(envType, queryUic, outMemberLoginId, country, openAccount, kycStatus, bindMobile) {
	console.log("CREATE_T_USER");
	var defered = Q.defer();

	var params = {
		openAccount: openAccount,
		bindMobile: bindMobile,
		kycStatus: kycStatus,
		envType: envType,
		queryUIC: queryUic,
		outMemberLoginId: outMemberLoginId,
		version: '1.0.0',
		userType: '2',
		country: country
	}
	
	callDataBankAgent('2454', JSON.stringify(params))
		.then(function (runInfos) {
			return getDataBankResult(runInfos);
		})
		.then(function (result) {
			defered.resolve(result.slice(result.indexOf('card_no=') + 8).trim());
		})
		.catch(function (err) {
			defered.reject(err);
		});

	return defered.promise;
}

function createQUser(envType, queryUic, outMemberLoginId, country) {
	console.log("CREATE_Q_USER");
	var defered = Q.defer();

	var params = {
		envType: envType,
		queryUIC: queryUic,
		outMemberLoginId: outMemberLoginId,
		version: '1.0.0',
		userType: '2',
		country: country
	};

	callDataBankAgent('2446', JSON.stringify(params))
		.then(function (runInfos) {
			return getDataBankResult(runInfos);
		})
		.then(function (result) {
			defered.resolve(result.slice(result.indexOf('card_no=') + 8).trim());
		})
		.catch(function (err) {
			defered.reject(err);
		});

	return defered.promise;
}

function creatNewIpayTradeNo(envType, buyerCardNo, cashAmount, couponAmount) {
	console.log("CREATE_TRADE_NO");
	var params = {
		expireTime: '2592000000',
		trade_channel: 'PC',
		trade_order_list: '[{"buyerCardNo":"2188205006685382","buyerShowName":"databank buyer","createDt":"2014-07-08 00:00:30.000|US/Pacific","expireDt":"1406530830000","tradeMainType":"AE_COMMON","site":"ru","safeStockTime":"1406803438000","activityIds":"98,99","goodsItemList":[{"rootCategory":"12","subCategories":"34/56","count":"1","itemNo":"62900102424272","price":"221.49","priceCur":"USD","title":"2014 New girls sandals kids boots children rivets pu shoes 4colors casual sandals for 2-10 years girls free shipping","unit":"piece"}],"intentPayAmount":"7855.35","intentPayCur":"RUB","logisticInfo":{"email":"helloipay@ipay.com","address1":"Molodegnaya 1/15","address2":"","contactPerson":"apitest buyer","faxNo":"--","mobileNo":"89022024650","phoneNo":"46-3812-89022024650","postCode":"644505","shippingCity":"Omsk","shippingCountry":"RU","shippingFee":"0.0","shippingFeeCur":"USD","shippingState":"Omsk Oblast","shippingMethod":"CPAM","shippingExt":{"CPF":"02367591911"}},"originAmount":"221.49","originAmountCur":"USD","partnerBuyerId":"1007825241","partnerOrderNo":"63311102424272","partnerSellerId":"1008757982","partnerSubType":"2088000001","preDefPayBillList":[{"direction":"OUT","participant":"BUYER","tradeAmount":"191.49","tradeAmountCur":"USD"},{"direction":"OUT","participant":"AE_COUPON","tradeAmount":"30","tradeAmountCur":"USD"}],"riskData":{"billToCity":"Omsk","billToCountry":"RU","billToEmail":"helloipay@ipay.com","billToPhoneNumber":"46381289022024650","billToPostalCode":"644505","billToState":"Omsk Oblast","billToStreet1":"Molodegnaya 1/15","billToStreet2":"","buyerAdminSeq":"1007825241","buyerLoginId":"db1007825240","buyerSeq":"1007825241","category2":"200000947","category3":"200001003","categoryLeaf":"200001003","categoryRoot":"322","item0ProductName":"2014 New girls sandals kids boots children rivets pu shoes 4colors casual sandals for 2-10 years girls free shipping","item0Quantiry":"1","item0UnitPrice":"22149","logisticsAmount":"0","mobileNo":"89022024650","outOrderId":"62900102424272","outRef":"62900102424272","productId":"1912777748","sellerAdminSeq":"1008757982","sellerLoginId":"db1008757981","sellerSeq":"1008757982","shipToCity":"Omsk","shipToContactName":"apitest buyer","shipToCountry":"RU","shipToPhoneNumber":"46381289022024650","shipToPostalCode":"644505","shipToShippingMethod":"CPAM","shipToState":"Omsk Oblast","shipToStreet1":"Molodegnaya 1/15","shipToStreet2":"","transactionTime":"2014-07-08 00:00:30","buyerServiceType":"IFM","sellerServiceType":"CGS","osType":"WINDOWS"},"sellerCardNo":"2188205002099413","sellerShowName":"databank seller","tradeAmount":"221.49","tradeAmountCur":"USD","tradeChannel":"pc","tradeRule":{"payChannelRule":{"supportPaymentType":"all"}}}]',
		databankServerUrl: 'http://databank.intl.alipay.net:8080',
		prod_code: 'DEFAULT_PRODUCT_CODE',
		env: envType,
		trade_cash_amount: cashAmount,
		trade_coupon_amount: couponAmount,
		newOrder: 'true',
		partnerSubType: '2088000001',
		version: '1.0.0',
		partner: '2188400000000016',
		sitbuyerCardNo: buyerCardNo,
		devbuyerCardNo: buyerCardNo,
		devItradeUrl: 'http://itrade.stable.alipay.net:8080'
	};

	return callDataBankAgent('2294', JSON.stringify(params))
		.then(function (runInfos) {
			return getDataBankResult(runInfos);
		});
}

function createTradeNoLoop (envType, buyerCardNo, cashAmount, couponAmount, combineTimes, orderNums, callback) {
	if (combineTimes <= 0) {
		return callback();
	}

	creatNewIpayTradeNo(envType, buyerCardNo.toString(), cashAmount.toString(), couponAmount.toString())
		.then(function (orderNum) {
			orderNums.push(orderNum);
			createTradeNoLoop (envType, buyerCardNo, cashAmount, couponAmount, combineTimes - 1, orderNums, callback);
		})
		.catch(function (err) {
			callback(err);
		});
}

module.exports = {
	createTUser: function (envType) {
		return createMember("ifm")
			.then(function (loginId) {
				return createTUser(envType, "N", loginId, "US", "Y", "I", "Y");
			});
	},
	createQUser: function (envType) {
		return createMember("ifm")
			.then(function (loginId) {
				return createQUser(envType, "N", loginId, "US");
			});
	},
	creatNewIpayTradeNo: function (envType, buyerCardNo, cashAmount, couponAmount, combineTimes) {
		var defered = Q.defer();

		var orderNums = [];
		createTradeNoLoop (envType, buyerCardNo, cashAmount, couponAmount, combineTimes, orderNums, function (err) {
			if (err) {
				defered.reject(err);
			} else {
				defered.resolve(orderNums.join(','));
			}
		});

		return defered.promise;
	}
};















