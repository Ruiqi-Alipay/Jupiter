var React = require('react'),
	ReactPropTypes = React.PropTypes,
	Dispatcher = require('../../dispatcher').utils;

var EditConsole = React.createClass({

	propTypes: {
		editTitle: ReactPropTypes.string.isRequired,
		selectFolderId: ReactPropTypes.string.isRequired
	},
	contextTypes: {
		router: ReactPropTypes.func
	},

	getInitialState: function () {
		return {
			editTitle: this.props.editTitle
		};
	},
	componentWillReceiveProps: function (nextProps) {
		this.setState({
			editTitle: nextProps.editTitle
		});
	},

	_onEditorChanged: function (event) {
		this.setState({
			editTitle: event.target.value
		});
	},
	_onCancelClicked: function (event) {
		this.context.router.transitionTo('dashboard', {section_id: 'script'}, {select_folder: this.props.selectFolderId});
	},
	_onSubmitClicked: function (event) {
		Dispatcher.updateFolder({
			folder: this.props.selectFolderId,
			title: this.state.editTitle
		});
		this.context.router.transitionTo('dashboard', {section_id: 'script'}, {select_folder: this.props.selectFolderId});
	},

	render: function () {
		var styles = {
			content: {
				'display': 'flex',
				'flexDirection': 'row',
				'alignItems': 'center',
				'justifyContent': 'space-between',
				'padding': '8px 8px 8px 0px'
			},
			icon: {
				'fontSize': '16px'
			},
			input: {
				'width': '60%'
			}
		};
		var editTitle = this.state.editTitle;

		return (
			<div className="panel panel-default" style={styles.content}>
				<div className="input-group" style={styles.input}>
					<span id="editTitle" className="input-group-addon glyphicon glyphicon-search" aria-hidden="true" style={styles.icon}></span>
				  	<input type="text" className="form-control" placeholder="enter folder title"
				  		ria-describedby="editTitle" value={editTitle} onChange={this._onEditorChanged}/>
				</div>
				<div className="btn-group" role="group" aria-label="...">
					<button type="button" className="btn btn-default btn-sm" onClick={this._onCancelClicked}>Cancel</button>
					<button type="button" style={{minWidth: '100px'}} className="btn btn-primary btn-sm" disabled={!editTitle} onClick={this._onSubmitClicked}>Submit</button>
				</div>
			</div>
		);
	}
});

module.exports = EditConsole;