class ScriptBasicPanel extends React.Component {
	render() {
		return (
			<div className="panel panel-default">
				
					{this.props.script.title}
				
			</div>
		);
	}
}

export default Relay.createContainer(ScriptBasicPanel, {
	fragments: {
		script: () => Relay.QL`
			fragment on Script {
				id,
				title
			}
		`
	}
});