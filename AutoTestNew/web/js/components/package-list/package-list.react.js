var React = require('react'),
	PackageListItem = require('./package-list-item.react');

module.exports = React.createClass({

	propTypes: {
		packages: React.PropTypes.array
	},

	render: function () {
		var packageItemViews;

		if (this.props.packages) {
			packageItemViews = this.props.packages.map(function (packageApk) {
				return (
					<PackageListItem key={packageApk.id} packageApk={packageApk}/>
				);
			});
		}

		return (
			<div className="panel panel-default">
				<ul className='list-group'>
					{packageItemViews}
				</ul>
			</div>
		);
	}
});