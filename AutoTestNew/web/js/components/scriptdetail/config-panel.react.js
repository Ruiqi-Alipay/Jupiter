var React = require('react'),
	ReactPropTypes = React.PropTypes,
	Dispatcher = require('../../dispatcher').utils;


module.exports = React.createClass({

	propTypes: {
		scripts: ReactPropTypes.array,
		select: ReactPropTypes.string
	},

	render: function () {


		return (
			<div className="panel panel-default">
			  <div className="panel-heading">
			  	<b>脚本预配置</b>
			  </div>
			  <div className="panel-body">

			  </div>
			</div>
		);
	}
});