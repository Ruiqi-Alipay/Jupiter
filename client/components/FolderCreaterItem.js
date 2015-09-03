import {content, iconStyle} from './styleSheet';
import CreateFolderMutation from '../mutations/CreateFolderMutation';

var ENTER_KEY_CODE = 13;
var ESC_KEY_CODE = 27;

class FolderCreaterItem extends React.Component {
	state = {
		title: ''
	}
	_onNewTitleChanged = (e) => {
		this.setState({
			title: e.target.value
		});
	}
	_onKeyDown = (e) => {
		if (e.keyCode === ENTER_KEY_CODE) {
			Relay.Store.update(new CreateFolderMutation({
				user: this.props.user,
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
						placeholder="New folder"
						ria-describedby="editTitle"
						value={this.state.title}
						onChange={this._onNewTitleChanged}
						onKeyDown={this._onKeyDown}/>
				</div>
			</div>
		);
	}
}

export default Relay.createContainer(FolderCreaterItem, {
	fragments: {
		user: () => Relay.QL`
			fragment on User {
				${CreateFolderMutation.getFragment('user')}
			}
		`
	}
});