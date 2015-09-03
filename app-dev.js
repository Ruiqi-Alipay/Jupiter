import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { GraphQLJupiterSchema } from './data/schema';
import mongoose from 'mongoose';

process.env.NODE_ENV = 'development';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

// Expose GraphQL endpoint
var graphQLServer = express();
graphQLServer.use('/', graphQLHTTP({
	schema: GraphQLJupiterSchema,
	pretty: true
}));
graphQLServer.listen(GRAPHQL_PORT, () => {
	console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`)
});

var compiler = webpack({
	entry: path.resolve(__dirname, 'client', 'app.js'),
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel',
				query: {
					stage: 0,
					plugins: ['./build/babelRelayPlugin']
				}
			}
		]
	},
	output: {filename: 'app.js', path: '/'}
});

mongoose.connect('mongodb://localhost/testdb');

var app = new WebpackDevServer(compiler, {
	contentBase: '/public/',
	proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
	publicPath: '/client/',
	stats: {coloes: true}
});

app.use('/', express.static('public'));
app.use('/node_modules', express.static('node_modules'));
app.listen(APP_PORT, () => {
	console.log(`Relay App is now running on http://localhost:${APP_PORT}`)
});





