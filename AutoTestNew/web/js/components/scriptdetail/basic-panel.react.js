var React = require('react'),
	ReactPropTypes = React.PropTypes,
	Dispatcher = require('../../dispatcher').utils;

module.exports = React.createClass({

	propTypes: {
		script: ReactPropTypes.object.isRequired
	},

	_onNameChanged: function (event) {
		Dispatcher.detailBasicUpdate({
			title: event.target.value
		});
	},
	_onOrderIdChanged: function (event) {
		Dispatcher.detailBasicUpdate({
			reference: event.target.value
		});
	},
	_onBuyerIdChanged: function (event) {
		Dispatcher.detailBasicUpdate({
			buyerId: event.target.value
		});
	},
	_onAmountChanged: function (event) {
		Dispatcher.detailBasicUpdate({
			amount: event.target.value
		});
	},
	_onCouponAmountChanged: function (event) {
		Dispatcher.detailBasicUpdate({
			couponAmount: event.target.value
		});
	},
	_onCountChanged: function (event) {
		Dispatcher.detailBasicUpdate({
			count: event.target.value
		});
	},
	_onScriptTypeSelected: function (type) {
		Dispatcher.detailBasicUpdate({
			type: type.code
		});
	},

	render: function () {
		var script = this.props.script,
			basicInfo = script ? script.content.order : undefined;

		var typeDisplay,
			scriptTypes = [
				{ code: 'Script', name: '执行脚本' },
				{ code: 'Config', name: '配置脚本' },
				{ code: 'SysConfig', name: '全局配置脚本' }
			],
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
		}

		return (
			<div className="panel panel-default">
			  <div className="panel-heading">
			  	<b>脚本基本信息</b>
			  </div>
			  <div className="panel-body">
				<div>
					<div className="btn-group" role="group" style={{marginLeft: '16px'}}>
						<button id='saveAs' type="button" className="btn btn-default btn-sm dropdown-toggle"
							data-toggle="dropdown" aria-expanded='false'>
							{typeDisplay}
							<span className="caret"></span>
						</button>
						<ul className="dropdown-menu" role="menu" aria-labelledby="saveAs">
							{typeViews}
						</ul>
					</div>
					<div className="input-group">
						<span className="input-group-addon" id="script-name">Name</span>
						<input type="text" className="form-control" placeholder="script name" aria-describedby="script-name" value={script ? script.title : ''} onChange={this._onNameChanged}/>
					</div>
					<div className="input-group">
						<span className="input-group-addon" id="order-id">Order ID</span>
						<input type="text" className="form-control" placeholder="order id" aria-describedby="order-id" value={basicInfo ? basicInfo.reference : ''} onChange={this._onOrderIdChanged}/>
					</div>
					<div className="input-group">
						<span className="input-group-addon" id="buyer-id">Buyer ID</span>
						<input type="text" className="form-control" placeholder="buyer id" aria-describedby="buyer-id" value={basicInfo ? basicInfo.buyerId : ''} onChange={this._onBuyerIdChanged}/>
					</div>
					<div className="input-group">
						<span className="input-group-addon" id="amount">Order Amount</span>
						<input type="text" className="form-control" placeholder="order amount" aria-describedby="amount" value={basicInfo ? basicInfo.amount : ''} onChange={this._onAmountChanged}/>
					</div>
					<div className="input-group">
						<span className="input-group-addon" id="coupon-amount">Coupon Amount</span>
						<input type="text" className="form-control" placeholder="order coupon amount" aria-describedby="coupon-amount" value={basicInfo ? basicInfo.couponAmount : ''} onChange={this._onCouponAmountChanged}/>
					</div>
					<div className="input-group">
						<span className="input-group-addon" id="count">Combine Times</span>
						<input type="text" className="form-control" placeholder="combine order times" aria-describedby="count" value={basicInfo ? basicInfo.count : ''} onChange={this._onCountChanged}/>
					</div>
				</div>
			  </div>
			</div>
		);
	}
});