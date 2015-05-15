var React = require('react');

module.exports = React.createClass({
	render: function () {
		return (
			    <div className="alert alert-warning alert-dismissible fade in" style={toastStyle} role="alert">
			      <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			      <strong>Holy guacamole!</strong> Best check yo self, you are not looking too good.
			    </div>
		);
	}
});