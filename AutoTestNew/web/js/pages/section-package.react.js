var React = require('react'),
	PackageConsole = require('../components/package-list/package-console.react'),
	PackageList = require('../components/package-list/package-list.react');

module.exports = React.createClass({

	propTypes: {
		packages: React.PropTypes.array
	},

	render: function () {
		return (
			<div className='row'>
				<div className='col-xs-10 col-xs-offset-1'>
					<PackageConsole/>
					<PackageList packages={this.props.packages}/>
				</div>
			</div>
		);
	}
});