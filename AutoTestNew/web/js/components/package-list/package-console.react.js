var React = require('react'),
	Dispatcher = require('../../dispatcher').utils;

var PackageConsole = React.createClass({

	getInitialState: function () {
		return {
			description: ''
		};
	},

	_onDescriptionChanged: function (event) {
		this.setState({
			description: event.target.value,
			file: this.state.file
		});
	},
	_onSelectFileChanged: function (event) {
		this.setState({
			description: this.state.description,
			file: event.target.files[0]
		});
	},
	_onUploadClicked: function (event) {
		Dispatcher.uploadPackage({
			file: this.state.file,
			description: this.state.description
		});
	},

	render: function () {
		var styles = {
			body: {
				'marginBottom': '20px',
				'display': 'flex',
				'flexDirection': 'row',
				'alignItems': 'center',
				'padding': '8px 0px'
			},
			icon: {
				'fontSize': '16px'
			},
			inputPart: {
				'width': '45%'
			},
			buttonPart: {
				'width': '55%',
				'display': 'flex',
				'flexDirection': 'row',
				'alignItems': 'center',
				'justifyContent': 'center'
			},
			selectBtn: {
				'marginRight': '10px',
				'marginLeft': '10px'
			}
		};
		var description = this.state.description,
			disableBtn = !this.state.file || !description || description.length == 0;

		return (
			<div className="panel panel-default" style={styles.body}>
				<div style={styles.inputPart}>
					<div className="input-group">
					    <span className="input-group-addon" id="new-value">Description</span>
					    <input type="text" className="form-control" placeholder="package description" aria-describedby="new-value" value={description} onChange={this._onDescriptionChanged}/>
					</div>
				</div>
				<div style={styles.buttonPart}>
					<input className="btn btn-default" style={styles.selectBtn} type="file" accept="*.apk" name='packageFile' onChange={this._onSelectFileChanged} />
					<button type="button" className="btn btn-primary" onClick={this._onUploadClicked} disabled={disableBtn}>Upload Package</button>
				</div>
			</div>
		);
	}
});

module.exports = PackageConsole;





