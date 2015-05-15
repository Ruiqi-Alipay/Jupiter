var React = require('react'),
	Dispatcher = require('../../../dispatcher/app-dispatcher'),
	Actions = require('../../../dispatcher/actions');

var FolderConsole = React.createClass({
	propTypes: {
		selectFolderId: React.PropTypes.string
	},
	getInitialState: function () {
		return {
			searchText: ''
		};
	},
	getDefaultProps: function () {
		return {
			styles: {
				content: {
					'display': 'flex',
					'flexDirection': 'row',
					'alignItems': 'center',
					'padding': '8px 8px 8px 0px'
				},
				icon: {
					'fontSize': '16px'
				},
				input: {
					'width': '50%'
				},
				button: {
					'width': '25%',
					'paddingLeft': '4px',
					'paddingRight': '4px'
				}
			}
		}
	},
	componentWillReceiveProps: function (nextProps) {
		if (nextProps.selectFolderId != this.props.selectFolderId) {
			this.setState({ searchText: '' });
		}
	},
	render: function () {
		var searchText = this.state.searchText;
		var styles = this.props.styles;

		return (
			<div className="panel panel-default" style={styles.content}>
				<div className="input-group col-xs-8" style={styles.input}>
					<span id="search" className="input-group-addon glyphicon glyphicon-search" aria-hidden="true" style={styles.icon}></span>
				  	<input type="text" className="form-control" placeholder="Search script title"
				  		ria-describedby="search" value={searchText} onChange={this._onSearchChanged}/>
				</div>
				<div className='col-xs-2' style={styles.button}><button type="button" className="btn btn-default btn-sm">Edit Folder</button></div>
				<div className='col-xs-2' style={styles.button}><button type="button" className="btn btn-danger btn-sm">Delete Folder</button></div>
			</div>
		);
	},
	_onSearchChanged: function (event) {
		var newSearchText = event.target.value;
		this.setState({
			searchText: newSearchText
		});
		Dispatcher.dispatch({
			type: Actions.SCRIPT_SEARCH_CHANGE,
			text: newSearchText
		});
	}
});

module.exports = FolderConsole;