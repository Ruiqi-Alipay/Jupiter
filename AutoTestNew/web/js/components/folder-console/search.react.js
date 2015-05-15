var React = require('react'),
	ReactPropTypes = React.PropTypes,
	Store = require('../../store'),
	Dispatcher = require('../../dispatcher').utils;

var FolderConsole = React.createClass({

	propTypes: {
		selectFolder: ReactPropTypes.object
	},
	contextTypes: {
		router: ReactPropTypes.func
	},

	getInitialState: function () {
		return {
			searchText: ''
		};
	},
	_onSearchScript: function (event) {
		Store.setScriptSearchText(event.target.value);
		this.setState({
			searchText: event.target.value
		});
	},
	_onEditClicked: function (event) {
		this.context.router.transitionTo('dashboard', {section_id: 'script'},
			{select_folder: this.props.selectFolder.id, editTitle: this.props.selectFolder.title});
	},
	_onDeleteClicked: function (event) {
		Dispatcher.deleteFolder(this.props.selectFolder.id);
	},
	_onNewScript: function (event) {
		this.context.router.transitionTo('dashboard', {section_id: 'script'},
			{select_folder: this.props.selectFolder.id, select_script: 'new'});
	},

	render: function () {
		var styles = {
			content: {
				'display': 'flex',
				'flexDirection': 'row',
				'justifyContent': 'space-between',
				'alignItems': 'center',
				'padding': '8px 8px 8px 0px'
			},
			icon: {
				'fontSize': '16px'
			},
			input: {
				'width': '40%'
			},
			button: {
				'width': '60%',
				'paddingLeft': '4px',
				'paddingRight': '4px'
			}
		};

		return (
			<div className="panel panel-default" style={styles.content}>
				<div className="input-group" style={styles.input}>
					<span id="search" className="input-group-addon glyphicon glyphicon-search" aria-hidden="true" style={styles.icon}></span>
				  	<input type="text" className="form-control" placeholder="Search script title"
				  		ria-describedby="search" value={this.state.searchText} onChange={this._onSearchScript}/>
				</div>
				<div className="btn-group" role="group" aria-label="...">
					<button type="button" className="btn btn-default btn-sm" onClick={this._onNewScript}>New Script</button>
					<button type="button" className="btn btn-default btn-sm" onClick={this._onEditClicked}>Edit Folder</button>
					<button type="button" className="btn btn-danger btn-sm" data-toggle="modal" data-target="#myModal">Delete Folder</button>
				</div>

				<div className="modal fade" id="myModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				  <div className="modal-dialog">
				    <div className="modal-content">
				      <div className="modal-header">
				        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				        <h4 className="modal-title">Delete Folder</h4>
				      </div>
				      <div className="modal-body">
				        <p>Delete this folder and all its containing scripts ?</p>
				      </div>
				      <div className="modal-footer">
				        <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
				        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this._onDeleteClicked}>Confirm</button>
				      </div>
				    </div>
				  </div>
				</div>
			</div>
		);
	}
});

module.exports = FolderConsole;