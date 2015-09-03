import FolderItem from './FolderItem';
var { PropTypes } = React;

class FolderList extends React.Component {
	static propTypes = {
		onItemSelected: PropTypes.func.isRequired
	}
	renderFolderItems() {
		if (this.props.user.folders) {
			return this.props.user.folders.edges.map(edge => {
				return (
					<FolderItem key={edge.node.id}
						user={this.props.user}
						folder={edge.node}
						select={false}
						onItemSelected={this.props.onItemSelected}/>
					);
			});
		}
	}
	render() {
		return (
			<div className="panel panel-default">
				<ul className='list-group'>
					{this.renderFolderItems()}
				</ul>
			</div>
		);
	}
}

export default Relay.createContainer(FolderList, {
	fragments: {
		user: () => Relay.QL`
			fragment on User {
				folders(first: 100) {
					totalCount,
					edges {
						node {
							${FolderItem.getFragment('folder')}
						}
					}
				},
				${FolderItem.getFragment('user')}
			}
		`
	}
});