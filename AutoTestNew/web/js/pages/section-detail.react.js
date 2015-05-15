var React = require('react'),
	ReactPropTypes = React.PropTypes,
	ControlPanel = require('../components/scriptdetail/control-panel.react'),
	BasicPanel = require('../components/scriptdetail/basic-panel.react'),
	ParameterPanel = require('../components/scriptdetail/parameter-panel.react'),
	ConfigPanel = require('../components/scriptdetail/config-panel.react'),
	StepPanel = require('../components/scriptdetail/step-panel.react');

function findArrayIndex (items, id) {
	for (var index in items) {
		if (items[index].id == id) {
			return parseInt(index);
		}
	}
}

module.exports = React.createClass({

	propTypes: {
		script: ReactPropTypes.object,
		folders: ReactPropTypes.array,
		configScripts: ReactPropTypes.array,
		folderScripts: ReactPropTypes.array,
		message: ReactPropTypes.string
	},

	render: function () {
		var script = this.props.script,
			configScripts = this.props.configScripts,
			folderScripts = this.props.folderScripts,
			folders = this.props.folders;

		var scriptIndex = -1,
			selectFolder;
		if (folderScripts && script) {
			scriptIndex = findArrayIndex(folderScripts, script.id);
		}
		if (folders && script) {
			selectFolder = folders[findArrayIndex(folders, script.folder)];
		}

		var messagePanel;
		if (this.props.message) {
			var indicatorClass;
			if (this.props.message.indexOf('success') > 0) {
				indicatorClass = 'alert-success';
			} else {
				indicatorClass = 'alert-danger'
			}
			messagePanel = (
			    <div className={'alert ' + indicatorClass + ' alert-dismissible fade in'} role="alert">
			      <strong>{this.props.message}</strong>
			    </div>
			);
		}
		
		return (
			<div className='row'>
				<div className='col-sm-10 col-sm-offset-1'>
					<ControlPanel index={scriptIndex} script={script} selectFolder={selectFolder} folders={folders} folderScripts={folderScripts}/>
					{messagePanel}
					<div className='row'>
						<div className='col-sm-5'>
							<BasicPanel script={script}/>
							<ParameterPanel parameters={script ? script.content.parameters : undefined}/>
						</div>
						<div className='col-sm-7'>
							<ConfigPanel scripts={configScripts} select={script ? script.content.configRef : undefined}/>
							<StepPanel actions={script ? script.content.actions : undefined}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});