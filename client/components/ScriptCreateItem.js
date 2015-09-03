import {content, iconStyle} from './styleSheet';
import CreateScriptMutation from '../mutations/CreateScriptMutation';

class ScriptCreateItem extends React.Component {
	state = {
		title: ''
	}
	_onNewTitleChanged = (e) => {
		this.setState({
			title: e.target.value
		});
	}
	_onKeyDown = (e) => {
		if (e.keyCode === 13) {
			Relay.Store.update(new CreateScriptMutation({
				folder: this.props.folder,
				title: this.state.title
			}));
			this.setState({ title: '' });
		}
	}
	render() {
		return (
			<div className="panel panel-default" style={content}>
				<div className="input-group">
					<span id="editTitle" className="input-group-addon glyphicon glyphicon-plus"
						aria-hidden="true" style={iconStyle}></span>
					<input type="text"
						className="form-control"
						placeholder="New script"
						ria-describedby="editTitle"
						value={this.state.title}
						onChange={this._onNewTitleChanged}
						onKeyDown={this._onKeyDown}/>
				</div>
			</div>
		);
	}
}

export default Relay.createContainer(ScriptCreateItem, {
	fragments: {
		folder: () => Relay.QL`
			fragment on Folder {
				id,
				${CreateScriptMutation.getFragment('folder')}
			}
		`
	}
});