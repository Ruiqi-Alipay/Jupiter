var React = require('react'),
	ReactPropTypes = React.PropTypes,
	Dispatcher = require('../../dispatcher').utils;

module.exports = React.createClass({

	propTypes: {
		folders: ReactPropTypes.array,
		folderScripts: ReactPropTypes.array,
		script: ReactPropTypes.object,
		selectFolder: ReactPropTypes.object,
		index: ReactPropTypes.number
	},
	contextTypes: {
		router: ReactPropTypes.func
	},

	_onBackClicked: function (event) {
		this.context.router.transitionTo(
			'dashboard',
			{section_id: 'script'}, {select_folder: this.props.script.folder});
	},
	_onNewClicked: function (event) {
		this.context.router.transitionTo(
			'dashboard',
			{section_id: 'script'}, {select_folder: this.props.script.folder, select_script: 'new'});
	},
	_onDeleteClicked: function (event) {
		Dispatcher.deleteScript();
	},
	_onSaveClicked: function (event) {
		Dispatcher.saveScript();
	},
	_onSaveAsSelected: function (folder) {
		Dispatcher.saveScriptAs(folder);
	},
	_onPreviousClicked: function (event) {
		var previousScript = this.props.folderScripts[this.props.index - 1];

		if (!previousScript) return;

		this.context.router.transitionTo('dashboard',
			{section_id: 'script'}, {select_folder: this.props.script.folder, select_script: previousScript.id});
	},
	_onNextClicked: function (event) {
		var nextScript = this.props.folderScripts[this.props.index + 1];

		if (!nextScript) return;

		this.context.router.transitionTo('dashboard',
			{section_id: 'script'}, {select_folder: this.props.script.folder, select_script: nextScript.id});
	},

	render: function () {
		var styles = {
			content: {
				'display': 'flex',
				'flexDirection': 'row',
				'alignItems': 'center',
				'justifyContent': 'space-between',
				'padding': '8px'
			},
			part: {
				'display': 'flex',
				'flexDirection': 'row',
				'alignItems': 'center'
			},
			pager: {
				'margin': '0px',
				'marginLeft': '10px'
			},
			gap: {
				'marginRight': '20px'
			}
		};
		var folderScripts = this.props.folderScripts,
			script = this.props.script,
			index = this.props.index;

		var rightPanel,
			firstScript,
			lastScript,
			saveAsFolderItems;

		if (!script || script.id) {
			var indicator;
			if (script && folderScripts) {
				indicator = (this.props.selectFolder ? this.props.selectFolder.title : '') + '  ' + (index + 1) + ' / ' + folderScripts.length;
				firstScript = index == 0;
				lastScript = (index + 1) == folderScripts.length;
			}

			rightPanel = (
				<div style={styles.part}>
					{indicator}
					<ul className="pager" style={styles.pager}>
					    <li className={firstScript ? 'disabled' : ''} disabled={firstScript} onClick={this._onPreviousClicked}><a><span aria-hidden="true">&larr;</span> Previous</a></li>
					    <li className={lastScript ? 'disabled' : ''} disabled={lastScript} onClick={this._onNextClicked}><a>Next <span aria-hidden="true">&rarr;</span></a></li>
					</ul>
				</div>
			);
		}

		if (this.props.folders) {
			saveAsFolderItems = this.props.folders.map(function (folder, index) {
				return (
					<li key={index} onClick={this._onSaveAsSelected.bind(this, folder.id)}>
						<a>{folder.title}</a>
					</li>
				);
			}, this);
		}

		return (
			<div className="panel panel-default" style={styles.content}>
				<div style={styles.part}>
					<button type="button" className="btn btn-warning" style={styles.gap} onClick={this._onBackClicked}>Back</button>
					<div className="btn-group" role="group" aria-label="...">
						<button type="button" className="btn btn-default" onClick={this._onNewClicked}>New</button>
						<button type="button" className="btn btn-default" onClick={this._onSaveClicked}>Save</button>
						<div className="btn-group" role="group">
							<button id='saveAs' type="button" className="btn btn-default dropdown-toggle"
								data-toggle="dropdown" aria-expanded='false'>
								Save As
								<span className="caret"></span>
							</button>
							<ul className="dropdown-menu" role="menu" aria-labelledby="saveAs">
								{saveAsFolderItems}
							</ul>
						</div>
						<button type="button" className="btn btn-danger" data-toggle="modal" data-target="#myModal">Delete</button>
					</div>
				</div>
				{rightPanel}

				<div className="modal fade" id="myModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				  <div className="modal-dialog">
				    <div className="modal-content">
				      <div className="modal-header">
				        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				        <h4 className="modal-title">Delete Script</h4>
				      </div>
				      <div className="modal-body">
				        <p>{'Delete scritp "' + (script ? script.title : '') + '" ?'}</p>
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
