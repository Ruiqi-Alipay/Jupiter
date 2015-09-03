import ParameterItem from './ParameterItem';
import UpdateParameterMutation from '../mutations/UpdateParameterMutation';

class ParameterList extends React.Component {
	_onAppendClicked = (e) => {
		Relay.Store.update(new UpdateParameterMutation({
			script: this.props.script,
			actionType: 'create'
		}));
	}
	renderParams() {
		if (this.props.script.params) {
			return this.props.script.params.map(param =>
				<ParameterItem key={param.position}
					script={this.props.script}
					param={param}/>
			);
		}
	}
	render() {
		var bottomBar = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-end',
			marginTop: '10px'
		};

		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<b>Script Parmaeter List</b>
				</div>
				<div className="panel-body">
					<ul className='list-group'>
						{this.renderParams()}
					</ul>
				    <div style={bottomBar}>
				    	<button type="button" className="btn btn-default btn-sm"
				    		onClick={this._onAppendClicked}>Append</button>
				    </div>
				</div>
			</div>
		);
	}
}

export default Relay.createContainer(ParameterList, {
	fragments: {
		script: () => Relay.QL`
			fragment on Script {
				params {
					${ParameterItem.getFragment('param')}
				},
				${ParameterItem.getFragment('script')},
				${UpdateParameterMutation.getFragment('script')}
			}
		`
	}
});