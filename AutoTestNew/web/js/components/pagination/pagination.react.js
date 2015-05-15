var React = require('react'),
	ReactPropTypes = React.PropTypes,
	PaginationItem = require('./pagination-item.react'),
	Dispatcher = require('../../dispatcher').utils,
	PureRenderMixin = require('react/addons').addons.PureRenderMixin;

module.exports = React.createClass({

	mixins: [PureRenderMixin],
	propTypes: {
		currentPage: ReactPropTypes.number,
		totalPage: ReactPropTypes.number
	},

	getInitialState: function () {
		return {
			startPage: 0
		};
	},
	componentWillReceiveProps: function (nextProps) {
		if (nextProps.currentPage >= 0) {
			var startPage = nextProps.currentPage - (nextProps.currentPage % 5);
			this.setState({
				startPage: startPage
			});
		}
	},

	_onPrevPages: function (event) {
		var newPage = Math.max(0, this.state.startPage - 5);
		Dispatcher.loadReports(newPage);
	},
	_onNextPages: function (event) {
		var newPage = Math.min(this.props.totalPage - 1, this.state.startPage + 5);
		Dispatcher.loadReports(newPage);
	},

	render: function () {
		var contentStyle = {
			'marginTop': '0px',
			'marginBottom': '0px'
		};

		var totalPage = this.props.totalPage,
			currentPage = this.props.currentPage,
			startPage = this.state.startPage,
			limit;

		var paginationItems = [];
		if (totalPage > 0 && currentPage >= 0 && startPage >= 0) {
			limit = Math.min(totalPage, startPage + 5);
			for (var i = startPage; i < limit; i++) {
				paginationItems.push(<PaginationItem key={i} index={i} active={currentPage == i}/>)
			}
		}

		return (
			<ul className="pagination" style={contentStyle}>
				<li key='prev' className={startPage == 0 ? 'disabled' : ''} onClick={this._onPrevPages}>
				  <a aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>
				</li>
				{paginationItems}
				<li key='next' className={limit == totalPage ? 'disabled' : ''} onClick={this._onNextPages}>
				  <a aria-label="Next"><span aria-hidden="true">&raquo;</span></a>
				</li>
			</ul>
		);
	}
});