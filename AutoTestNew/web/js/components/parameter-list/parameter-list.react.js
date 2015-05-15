var React = require('react'),
	ReactPropTypes = React.PropTypes,
	ParameterListItem = require('./parameter-list-item.react');

module.exports = React.createClass({

	propTypes: {
		parameters: ReactPropTypes.array,
		searchText: ReactPropTypes.string
	},

	render: function () {
		var packageItemViews;
		if (this.props.parameters) {
			var searchText = this.props.searchText;
			packageItemViews = this.props.parameters.filter(function (element) {
                if (!searchText || searchText.length == 0 || element.name.indexOf(searchText) >= 0) {
                    return true;
                }
            }).map(function (parameter) {
				return (
					<ParameterListItem key={parameter.id} parameter={parameter}/>
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