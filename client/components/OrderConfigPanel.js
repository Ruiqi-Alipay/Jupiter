class OrderConfigPanel extends React.Component {
	state = {
		buyerId: this.props.script.orderConfig ? this.props.script.orderConfig.buyerId : '',
		amount: this.props.script.orderConfig ? this.props.script.orderConfig.amount : '',
		couponAmount: this.props.script.orderConfig ? this.props.script.orderConfig.couponAmount : '',
		repeat: this.props.script.orderConfig ? this.props.script.orderConfig.repeat : '',
		outputKey: this.props.script.orderConfig ? this.props.script.orderConfig.outputKey : ''
	}
	_onBuyerIdChanged = (e) => {
		this.setState({
			buyerId: e.target.value
		});
	}
	_onAmountChanged = (e) => {
		this.setState({
			amount: e.target.value
		});
	}
	_onCouponAmountChanged = (e) => {
		this.setState({
			couponAmount: e.target.value
		});
	}
	_onRepeatChanged = (e) => {
		this.setState({
			repeat: e.target.value
		});
	}
	_onOutputKeyChanged = (e) => {
		this.setState({
			outputKey: e.target.value
		});
	}
	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<b>Script Order Config</b>
				</div>
				<div className="panel-body">
					<div className="input-group">
						<span className="input-group-addon" id="buyer-id">Buyer ID</span>
						<input type="text" className="form-control" placeholder="buyer id" aria-describedby="buyer-id" value={this.state.buyerId} onChange={this._onBuyerIdChanged}/>
					</div>
					<div className="input-group">
						<span className="input-group-addon" id="amount">Amount</span>
						<input type="text" className="form-control" placeholder="order amount" aria-describedby="amount" value={this.state.amount} onChange={this._onAmountChanged}/>
					</div>
					<div className="input-group">
						<span className="input-group-addon" id="coupon-amount">Coupon Amount</span>
						<input type="text" className="form-control" placeholder="order coupon amount" aria-describedby="coupon-amount" value={this.state.couponAmount} onChange={this._onCouponAmountChanged}/>
					</div>
					<div className="input-group">
						<span className="input-group-addon" id="count">Repeat Times</span>
						<input type="text" className="form-control" placeholder="combine order times" aria-describedby="count" value={this.state.repeat} onChange={this._onRepeatChanged}/>
					</div>
					<div className="input-group">
						<span className="input-group-addon" id="order-id">Output Key</span>
						<input type="text" className="form-control" placeholder="generated id output parameter key" aria-describedby="order-id" value={this.state.outputKey} onChange={this._onOutputKeyChanged}/>
					</div>
				</div>
			</div>
		);
	}
}

export default Relay.createContainer(OrderConfigPanel, {
	fragments: {
		script: () => Relay.QL`
			fragment on Script {
				orderConfig {
					buyerId,
					amount,
					couponAmount,
					repeat,
					outputKey
				}
			}
		`
	}
});