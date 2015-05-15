var React = require('react'),
	Dispatcher = require('../../dispatcher').utils;

var CreateConsole = React.createClass({

	getInitialState: function () {
		return {
			title: ''
		};
	},

	_onTitleChanged: function (event) {
		this.setState({
			title: event.target.value
		});
	},
	_onSubmitClicked: function (event) {
		Dispatcher.createFolder(this.state.title);
		this.setState({title: ''});
	},

	render: function () {
		var styles = {
			content: {
				'display': 'flex',
				'flexDirection': 'row',
				'alignItems': 'center',
				'padding': '8px 8px 8px 0px'
			},
			icon: {
				'fontSize': '16px'
			},
			input: {
				'width': '70%'
			},
			button: {
				'width': '30%',
				'paddingLeft': '8px',
				'paddingRight': '4px'
			}
		};

		var title = this.state.title;

		return (
			<div className="panel panel-default" style={styles.content}>
				<div className="input-group" style={styles.input}>
					<span id="title" className="input-group-addon glyphicon glyphicon-search" aria-hidden="true" style={styles.icon}></span>
				  	<input type="text" className="form-control" placeholder="enter folder title"
				  		ria-describedby="title" value={title} onChange={this._onTitleChanged}/>
				</div>
				<div style={styles.button}>
					<button type="button" className="btn btn-primary btn-block btn-sm"
						disabled={!title} onClick={this._onSubmitClicked}>Submit</button>
				</div>
			</div>
		);
	}
});

module.exports = CreateConsole;