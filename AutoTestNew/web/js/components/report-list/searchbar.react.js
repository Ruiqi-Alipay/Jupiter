var React = require('react'),
	ReactPropTypes = React.PropTypes,
	Dispatcher = require('../../dispatcher').utils;

module.exports = React.createClass({

	propTypes: {
		searchText: ReactPropTypes.string,
	},

	_onSearchChanged: function (event) {
		Dispatcher.searchReport(event.target.value);
	},

	render: function () {
		var iconStyle = {
			'fontSize': '16px'
		};

		return (
			<div className="input-group">
				<span id="search" className="input-group-addon glyphicon glyphicon-search" aria-hidden="true" style={iconStyle}></span>
			  	<input type="text" className="form-control" placeholder='search for title'
			  		ria-describedby="search" value={this.props.searchText} onChange={this._onSearchChanged}/>
			</div>
		);
	}
});