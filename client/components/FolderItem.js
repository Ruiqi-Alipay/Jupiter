import classNames from 'classNames';
import UpdateFolderMutation from '../mutations/UpdateFolderMutation';
import DeleteFolderMutation from '../mutations/DeleteFolderMutation';
import { horizontal } from './styleSheet';
var { PropTypes } = React;

class FolderItem extends React.Component {
	static propTypes = {
		onItemSelected: PropTypes.func.isRequired,
		select: PropTypes.bool.isRequired
	}
	state = {
		isEditing: false,
		editText: ''
	}
	_onItemClicked = (e) => {
		this.props.onItemSelected(this.props.folder);
	}
	_onEditClicked = (e) => {
		this.setState({
			isEditing: !this.state.isEditing,
			editText: this.props.folder.title
		});
	}
	_onDeleteClicked = (e) => {
		Relay.Store.update(new DeleteFolderMutation({
			user: this.props.user,
			folder: this.props.folder
		}));
	}
	_onEditTitleChanged = (e) => {
		this.setState({
			editText: e.target.value
		});
	}
	_onEditKeyDown = (e) => {
		if (e.keyCode === 13) {
			Relay.Store.update(new UpdateFolderMutation({
				folder: this.props.folder,
				title: this.state.editText
			}));
			this.setState({
				isEditing: false
			});
		}
	}
	renderContent() {
		var iconStyle = {
			fontSize: '16px',
			marginRight: '10px'
		};

		return this.state.isEditing ? (
			<div className="input-group input-group-sm" style={{width: '50%'}}>
				<span id="editTitle" className="input-group-addon glyphicon glyphicon-pencil" aria-hidden="true"></span>
			  	<input type="text" className="form-control" placeholder="Foler name can not be empty"
			  		ria-describedby="editTitle" value={this.state.editText} onChange={this._onEditTitleChanged} onKeyDown={this._onEditKeyDown}/>
			</div>
		) : (
			<div>
				<span className={classNames({'glyphicon': true, 'glyphicon-folder-open': this.props.select, 'glyphicon-folder-close': !this.props.select})} style={iconStyle} aria-hidden="true"></span>
				{this.props.folder.title}
			</div>
		);
	}
	render() {
		var content = {
			'display': 'flex',
			'flexDirection': 'row',
			'justifyContent': 'space-between',
			'alignItems': 'center'
		};

		return (
			<a className={classNames({'list-group-item': true, 'active': this.props.select})}
					onClick={this._onItemClicked}>
				<div style={content}>
					{this.renderContent()}
					<div className="btn-group" role="group" aria-label="...">
						<button type="button" className="btn btn-xs btn-default" style={{padding: '0px 16px'}} onClick={this._onEditClicked}>{this.state.isEditing ? 'Cancel' : 'Edit'}</button>
						<button type="button" className="btn btn-xs btn-danger" onClick={this._onDeleteClicked}>Delete</button>
					</div>
				</div>
			</a>
		);
	}
}

export default Relay.createContainer(FolderItem, {
	fragments: {
		folder: () => Relay.QL`
			fragment on Folder {
				id,
				title,
				${UpdateFolderMutation.getFragment('folder')},
				${DeleteFolderMutation.getFragment('folder')}
			}
		`,
		user: () => Relay.QL`
			fragment on User {
				${DeleteFolderMutation.getFragment('user')}
			}
		`
	}
});