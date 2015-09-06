var React = require('react'),
	StepItem = require('./step-item.react'),
	Dispatcher = require('../../dispatcher').utils;

module.exports = React.createClass({

	propTypes: {
		actions: React.PropTypes.array
	},

	_onAppendClicked: function (event) {
		Dispatcher.detailCreateAction({
			index: this.props.actions ? this.props.actions.length : 0
		});
	},

	render: function () {
		var bottomBar = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-end',
			marginTop: '10px'
		};
		var actionTypes = [
			'点击',
			'点击位置',
			'输入',
			'阿里键盘输入',
			'阿里密码输入',
			'BACK',
			'选择',
			'快速选择',
			'单选位置',
			'多选位置',
			'清除',
			'向上滚动',
			'向下滚动',
			'文案校验'
		];
		var actionItems;
		if (this.props.actions) {
			actionItems = this.props.actions.map(function (action, index) {
				return (
					<StepItem
						key={index}
						action={action}
						index={index + 1}
						actionTypes={actionTypes}/>
				);
			});
		}

		return (
			<div className="panel panel-default">
			  <div className="panel-heading">
			  	<b>脚本行为设定</b>
			  </div>
			  <div className="panel-body">
			    {actionItems}
			    <div style={bottomBar}>
			    	<button type="button" className="btn btn-default btn-sm" onClick={this._onAppendClicked}>Append</button>
			    </div>
			  </div>
			</div>
		);
	}
});