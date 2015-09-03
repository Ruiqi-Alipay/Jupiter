import ScriptItem from './ScriptItem';
var { PropTypes } = React;

class ScriptList extends React.Component {
	static propTypes = {
		onItemSelected: PropTypes.func.isRequired
	}
	renderScriptItems() {
		if (this.props.folder.scripts) {
			return this.props.folder.scripts.edges.map(edge => {
				return (
					<ScriptItem key={edge.node.id}
						folder={this.props.folder}
						script={edge.node}
						onItemSelected={this.props.onItemSelected}/>
					);
			});
		}
	}
	render() {
		return (
			<div className="panel panel-default">
				<ul className='list-group'>
					{this.renderScriptItems()}
				</ul>
			</div>
		);
	}
}

export default Relay.createContainer(ScriptList, {
	fragments: {
		folder: () => Relay.QL`
			fragment on Folder {
				scripts(first: 100) {
					totalCount,
					edges {
						node {
							${ScriptItem.getFragment('script')}
						}
					}
				},
				${ScriptItem.getFragment('folder')}
			}
		`
	}
});