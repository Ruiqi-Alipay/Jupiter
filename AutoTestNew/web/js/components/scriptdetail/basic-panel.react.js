var React = require('react'),
	ReactPropTypes = React.PropTypes,
	Dispatcher = require('../../dispatcher').utils;

var scriptTypes = [
	{ code: 'Script', name: '执行脚本' },
	{ code: 'Config', name: '配置脚本' },
	{ code: 'SysConfig', name: '全局配置脚本' }
];

function findScriptTitle (scripts, targetId) {
	for (var index in scripts) {
		if (scripts[index].id == targetId) {
			return scripts[index].title;
		}
	}
}

module.exports = React.createClass({

	propTypes: {
		script: ReactPropTypes.object.isRequired,
		scripts: ReactPropTypes.array,
		select: ReactPropTypes.string
	},

	_onNameChanged: function (event) {
		Dispatcher.detailBasicUpdate({
			title: event.target.value
		});
	},
	_onOrderIdChanged: function (event) {
		Dispatcher.detailBasicUpdate({
			orderId: event.target.value
		});
	},
	_onBuyerIdChanged: function (event) {
		Dispatcher.detailBasicUpdate({
			buyerId: event.target.value
		});
	},
	_onAmountChanged: function (event) {
		Dispatcher.detailBasicUpdate({
			orderAmount: event.target.value
		});
	},
	_onCouponAmountChanged: function (event) {
		Dispatcher.detailBasicUpdate({
			orderCouponAmount: event.target.value
		});
	},
	_onCountChanged: function (event) {
		Dispatcher.detailBasicUpdate({
			orderCombineTimes: event.target.value
		});
	},
	_onScriptTypeSelected: function (type) {
		Dispatcher.detailBasicUpdate({
			type: type.code
		});
	},
	_onSelectScript: function (scriptId) {
		Dispatcher.detailConfigScriptUpdate(scriptId);
	},

	render: function () {
		var script = this.props.script,
			select = this.props.select,
			scripts = this.props.scripts,
			selectTitle = '(无)',
			configScriptViews;

		var typeDisplay,
			typeViews = scriptTypes.map(function (type, index) {
				return (<li key={index} onClick={this._onScriptTypeSelected.bind(this, type)}><a>{type.name}</a></li>);
			}, this);

		if (script) {
			switch (script.type) {
				case scriptTypes[0].code:
					typeDisplay = scriptTypes[0].name;
					break;
				case scriptTypes[1].code:
					typeDisplay = scriptTypes[1].name;
					break;
				case scriptTypes[2].code:
					typeDisplay = scriptTypes[2].name;
					break;
			}

			if (scripts) {
				if (select) {
					selectTitle = findScriptTitle(scripts, select);
				}
				configScriptViews = scripts.map(function (script, index) {
					return (
						<li key={index} onClick={this._onSelectScript.bind(this, script.id)}>
							<a>{script.title}</a>
						</li>
					);
				}, this)
				configScriptViews.unshift(
					<li key='-1' onClick={this._onSelectScript.bind(this, '')}>
						<a>(无)</a>
					</li>
				);
			}
		}

		return (
			<div className="panel panel-default">
			  <div className="panel-heading">
			  	<b>脚本基本信息</b>
			  </div>
			  <div className="panel-body">
				<div>
					<div className="row" style={{paddingLeft: '32px', paddingBottom: '10px'}}>
						Script Type:
						<div className="btn-group" role="group" style={{marginLeft: '10px'}}>
							<button id='saveAs' type="button" className="btn btn-default btn-sm dropdown-toggle"
								data-toggle="dropdown" aria-expanded='false'>
								{typeDisplay}
								<span className="caret"></span>
							</button>
							<ul className="dropdown-menu" role="menu" aria-labelledby="saveAs">
								{typeViews}
							</ul>
						</div>
					</div>
					<div className="row" style={{paddingLeft: '32px'}}>
						Config Script:
						<div className="btn-group" role="group" style={{marginLeft: '10px'}}>
							<button id='actionType' type="button" className="btn btn-default btn-sm dropdown-toggle"
								data-toggle="dropdown" aria-expanded='false'>
								{selectTitle}
								<span className="caret"></span>
							</button>
							<ul className="dropdown-menu" role="menu" aria-labelledby="actionType">
								{configScriptViews}
							</ul>
						</div>
					</div>
					<div className="input-group">
						<span className="input-group-addon" id="script-name">Name</span>
						<input type="text" className="form-control" placeholder="script name" aria-describedby="script-name" value={script ? script.title : ''} onChange={this._onNameChanged}/>
					</div>
					<div className="input-group">
						<span className="input-group-addon" id="order-id">Order ID</span>
						<input type="text" className="form-control" placeholder="order id" aria-describedby="order-id" value={script ? script.orderId : ''} onChange={this._onOrderIdChanged}/>
					</div>
					<div className="input-group">
						<span className="input-group-addon" id="buyer-id">Buyer ID</span>
						<input type="text" className="form-control" placeholder="buyer id" aria-describedby="buyer-id" value={script ? script.buyerId : ''} onChange={this._onBuyerIdChanged}/>
					</div>
					<div className="input-group">
						<span className="input-group-addon" id="amount">Order Amount</span>
						<input type="text" className="form-control" placeholder="order amount" aria-describedby="amount" value={script ? script.orderAmount : ''} onChange={this._onAmountChanged}/>
					</div>
					<div className="input-group">
						<span className="input-group-addon" id="coupon-amount">Coupon Amount</span>
						<input type="text" className="form-control" placeholder="order coupon amount" aria-describedby="coupon-amount" value={script ? script.orderCouponAmount : ''} onChange={this._onCouponAmountChanged}/>
					</div>
					<div className="input-group">
						<span className="input-group-addon" id="count">Combine Times</span>
						<input type="text" className="form-control" placeholder="combine order times" aria-describedby="count" value={script ? script.orderCombineTimes : ''} onChange={this._onCountChanged}/>
					</div>
				</div>
			  </div>
			</div>
		);
	}
});