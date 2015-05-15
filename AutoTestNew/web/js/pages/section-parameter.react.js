var React = require('react'),
	ReactPropTypes = React.PropTypes,
	ParameterList = require('../components/parameter-list/parameter-list.react'),
	ParameterNewConsole = require('../components/parameter-list/parameter-console-new.react'),
	ParameterUpdateConsole = require('../components/parameter-list/parameter-console-update.react');

module.exports = React.createClass({

	propTypes: {
		parameters: ReactPropTypes.array,
		edit_id: ReactPropTypes.string,
		searchText: ReactPropTypes.string
	},

	render: function () {
		var parameters = this.props.parameters,
			editId = this.props.edit_id;

		var editParameter;
		if (editId && parameters) {
			for (var index in parameters) {
				var parameter = parameters[index];
				if (parameter.id == editId) {
					editParameter = parameter;
					break;
				}
			}
		}
		
		var consoleView;
		if (editParameter) {
			consoleView = <ParameterUpdateConsole editParameter={editParameter}/>;
		} else {
			consoleView = <ParameterNewConsole/>
		}

		return (
			<div className='row'>
				<div className='col-xs-10 col-xs-offset-1'>
					{consoleView}
					<ParameterList parameters={parameters} searchText={this.props.searchText}/>
				</div>
			</div>
		);
	}
});
