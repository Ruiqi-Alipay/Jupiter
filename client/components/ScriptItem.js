var { PropTypes } = React;

class ScriptItem extends React.Component {
	static propTypes = {
		onItemSelected: PropTypes.func.isRequired
	}
	_onItemClicked = (e) => {
		this.props.onItemSelected(this.props.script);
	}
	render() {
		var content = {
			'display': 'flex',
			'flexDirection': 'row',
			'justifyContent': 'space-between',
			'alignItems': 'center'
		};

		return (
			<a className='list-group-item'
					onClick={this._onItemClicked}>
				<div style={content}>
					<div>{this.props.script.title}</div>
					<div>{this.props.script.date}</div>
				</div>
			</a>
		);
	}
}

export default Relay.createContainer(ScriptItem, {
	fragments: {
		script: () => Relay.QL`
			fragment on Script {
				id,
				title,
				date
			}
		`,
		folder: () => Relay.QL`
			fragment on Folder {
				id
			}
		`
	}
});