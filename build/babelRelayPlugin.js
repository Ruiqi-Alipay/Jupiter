var getBabeRelayPlugin = require('babel-relay-plugin');
var schema = require('../data/schema.json');

module.exports = getBabeRelayPlugin(schema.data);