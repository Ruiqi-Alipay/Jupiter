var express = require('express'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	mongoose = require('mongoose'),
	favicon = require('serve-favicon'),
	multer = require('multer'),
	path = require('path');

mongoose.connect('mongodb://localhost/news', function (err) {
	if (err) {
		return console.log(err);
	}

	var app = express();

	app.use(multer({
		dest: path.join(__dirname, 'uploads'),
	    rename: function(fieldname, filename) {
	        return filename;
	    }
	}));
	app.use(cookieParser());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use('/api', require(path.join(__dirname, 'server', 'rest-apis')));
	app.use('/uploads', express.static(path.join(__dirname, 'static', 'uploads')));
	app.use('/reports', express.static(path.join(__dirname, 'static', 'reports')));

	var isProduction = process.env.NODE_ENV === 'production';
	var port = isProduction ? 80 : 8080;
	if (!isProduction) {
		var webpack = require('webpack'),
			WebpackDevServer = require('webpack-dev-server'),
			config = require('./web/webpack.config'),
			httpProxy = require('http-proxy'),
			proxy = httpProxy.createProxyServer({
				changeOrigin: true,
				ws: true
			});

		var webpackPort = 3000;

		new WebpackDevServer(webpack(config), {
			contentBase: path.join(__dirname, 'build'),
			publicPath: config.output.publicPath,
			hot: true,
			historyApiFallback: true,
			stats: {
				colors: true
			}
		}).listen(webpackPort, 'localhost', function (err) {
			if (err) {
				console.log(err);
			}

			console.log('Wepack dev server listen on port: ' + webpackPort);
		});

		app.all('/*', function (req, res) {
			proxy.web(req, res, {
				target: 'http://localhost:' + webpackPort
			});
		});
	} else {
		app.use('/', express.static(path.join(__dirname, 'web')));
	}

	app.listen(port, function () {
		console.log('Automation server now listen on port: ' + port);
	})
});