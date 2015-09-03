import RegisterPanel from './RegisterPanel';
import FolderCreaterItem from './FolderCreaterItem';
import FolderList from './FolderList';
import ScriptCreateItem from './ScriptCreateItem';
import ScriptList from './ScriptList';
import ScriptBasicPanel from './ScriptBasicPanel';
import ActionList from './ActionList';
import ParameterList from './ParameterList';
import OrderConfigPanel from './OrderConfigPanel';

class Application extends React.Component {
	_onFolderItemSelected = (folder) => {
		this.props.relay.setVariables({
			selectFolderId: folder.id
		});
	}
	_onScriptItemSelected = (script) => {
		this.props.relay.setVariables({
			selectScriptId: script.id
		});
	}
	render() {
		var app = this.props.app;

		return (
			<div>
				<RegisterPanel user={app.user}/>
				<FolderCreaterItem user={app.user}/>
				<FolderList user={app.user}
					onItemSelected={this._onFolderItemSelected}/>
				{app.selectFolder&&<ScriptCreateItem folder={app.selectFolder}/>}
				{app.selectFolder&&<ScriptList folder={app.selectFolder} onItemSelected={this._onScriptItemSelected}/>}
				{app.selectScript&&<ScriptBasicPanel script={app.selectScript}/>}
				{app.selectScript&&<ActionList script={app.selectScript} config={app.config}/>}
				{app.selectScript&&<ParameterList script={app.selectScript}/>}
				{app.selectScript&&<OrderConfigPanel script={app.selectScript}/>}
			</div>
		);
	}
}

export default Relay.createContainer(Application, {
	initialVariables: {
		username: 'liruiqi',
		selectFolderId: '',
		selectScriptId: ''
	},
	fragments: {
		app: () => Relay.QL`
			fragment on Application {
				config {
					${ActionList.getFragment('config')}
				},
				user(username: $username) {
					${RegisterPanel.getFragment('user')},
					${FolderCreaterItem.getFragment('user')},
					${FolderList.getFragment('user')}
				},
				selectFolder(id: $selectFolderId) {
					${ScriptCreateItem.getFragment('folder')},
					${ScriptList.getFragment('folder')}
				},
				selectScript(id: $selectScriptId) {
					${ScriptBasicPanel.getFragment('script')},
					${ActionList.getFragment('script')},
					${ParameterList.getFragment('script')},
					${OrderConfigPanel.getFragment('script')}
				}
			}
		`
	}
});



