var io;

module.exports = {
	start: function (http) {
		io = require('socket.io')(http);
	},
	emit: function (key, message) {
		io.emit(key, message);
	}
};