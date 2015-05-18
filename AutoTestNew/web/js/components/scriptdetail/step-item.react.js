var React = require('react'),
	ReactPropTypes = React.PropTypes,
	Dispatcher = require('../../dispatcher').utils;

module.exports = React.createClass({

	propTypes: {
		action: ReactPropTypes.object.isRequired,
		index: ReactPropTypes.number.isRequired,
		actionTypes: ReactPropTypes.array.isRequired
	},

	_onSelectType: function (event) {
		Dispatcher.detailUpdateAction({
			index: this.props.index - 1,
			type: event.target.text
		});
	},
	_onSelectTarget: function (event) {
		Dispatcher.detailUpdateAction({
			index: this.props.index - 1,
			target: event.target.text
		});
	},
	_onInsertClicked: function (event) {
		Dispatcher.detailCreateAction({
			index: this.props.index - 1
		});
	},
	_onDeleteClicked: function (event) {
		Dispatcher.detailDeleteAction({
			index: this.props.index - 1
		});
	},
	_onPramInputChange: function (event) {
		Dispatcher.detailUpdateAction({
			index: this.props.index - 1,
			param: event.target.value
		});
	},
	_onTargetInputChange: function (event) {
		Dispatcher.detailUpdateAction({
			index: this.props.index - 1,
			target: event.target.value
		});
	},

	render: function () {
		var styles = {
			body: {
				'padding': '4px 0px'
			},
			horizontal: {
				'display': 'flex',
				'flexDirection': 'row',
				'alignItems': 'center'
			},
			content: {
				'display': 'flex',
				'flexDirection': 'row',
				'justifyContent': 'space-between',
				'alignItems': 'center'
			},
			gap: {
				'marginRight': '8px'
			},
			input: {
				'paddingLeft': '25px'
			}
		};
		var actionTypeViews = this.props.actionTypes.map(function (type, index) {
			return (
				<li key={index}><a onClick={this._onSelectType}>{type}</a></li>
			);
		}, this);

		var targets,
			targetView = '',
			paramView = ''
			action = this.props.action;

		if (action.type == '点击（按位置）') {
			targets = ['按钮', '图片'];
		} else if (action.type == '输入' || action.type == '阿里键盘输入' || action.type == '阿里数字键盘输入') {
			targets = ['编辑框'];
			paramView = (<input className="form-control" type="text" value={action.param} onChange={this._onPramInputChange}/>);
		} else if (action.type == '单选（按位置）') {
			targets = ['单选框'];
		} else if (action.type == '多选（按位置）') {
			targets = ['多选框'];
		} else if (action.type == '点击') {
			paramView = (<input className="form-control" type="text" value={action.target} onChange={this._onTargetInputChange}/>);
		} else if (action.type == '文案校验') {
			paramView = (<input className="form-control" type="text" value={action.target} onChange={this._onTargetInputChange}/>);
		}

		if (targets) {
			var targetItems = [];
			targets.forEach(function (target) {
				for (var index = 1; index <= 10; index++) {
					targetItems.push(target + '[' + index + ']');
				}
			});
			var actionTargetViews = targetItems.map(function (target, index) {
				return (
					<li key={index}><a onClick={this._onSelectTarget}>{target}</a></li>
				);
			}, this);
			
			targetView = (
				<div className="btn-group" role="group">
					<button id='actionType' type="button" className="btn btn-default btn-sm dropdown-toggle"
						data-toggle="dropdown" aria-expanded='false'>
						{action.target}
						<span className="caret"></span>
					</button>
					<ul className="dropdown-menu" role="menu" aria-labelledby="actionType">
						{actionTargetViews}
					</ul>
				</div>
			);
		}

		return (
			<div style={styles.body}>
				<div style={styles.content}>
					<div style={styles.horizontal}>
						<span className="label label-default" style={styles.gap}>{this.props.index}</span>
						<div className="btn-group" role="group" aria-label="...">
							<div className="btn-group" role="group">
								<button id='actionType' type="button" className="btn btn-default btn-sm dropdown-toggle"
									data-toggle="dropdown" aria-expanded='false'>
									{action.type}
									<span className="caret"></span>
								</button>
								<ul className="dropdown-menu" role="menu" aria-labelledby="actionType">
									{actionTypeViews}
								</ul>
							</div>
							{targetView}
						</div>
					</div>
					<div style={styles.horizontal}>
						<div className="btn-group" role="group">
							<button type="button" className="btn btn-default btn-sm" onClick={this._onInsertClicked}>Insert</button>
							<button type="button" className="btn btn-default btn-sm" onClick={this._onDeleteClicked}>X</button>
						</div>
					</div>
				</div>
				<div style={styles.input}>
					{paramView}
				</div>
			</div>
		);
	}
});




