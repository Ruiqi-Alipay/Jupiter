var React = require('react'),
	ReactPropTypes = React.PropTypes,
	SearchBar = require('./searchbar.react'),
	Pagination = require('../pagination/pagination.react');

module.exports = React.createClass({

	propTypes: {
		searchText: ReactPropTypes.string,
		currentPage: ReactPropTypes.number,
		totalPage: ReactPropTypes.number
	},

	render: function () {
		var styles = {
			content: {
				'display': 'flex',
				'flexDirection': 'row',
				'alignItems': 'center',
				'padding': '8px 8px 8px 0px'
			},
			searchbar: {
				'width': '60%',
				'paddingRight': '10px'
			},
			pagePar: {
				'width': '40%',
				'display': 'flex',
				'flexDirection': 'row',
				'justifyContent': 'center',
				'alignItems': 'center'
			}
		};

		var props = this.props;

		return (
			<div className="panel panel-default" style={styles.content}>
				<div style={styles.searchbar}>
					<SearchBar
						searchText={props.searchText}/>
				</div>
				<Pagination
					style={styles.pagePar}
					currentPage={props.currentPage}
					totalPage={props.totalPage}/>
			</div>
		);
	}
});








