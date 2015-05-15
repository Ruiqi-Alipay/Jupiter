var React = require('react'),
	ReactPropTypes = React.PropTypes,
	Dispatcher = require('../../dispatcher').utils;

function findScriptTitle (scripts, targetId) {
	for (var index in scripts) {
		if (scripts[index].id == targetId) {
			return scripts[index].title;
		}
	}
}

module.exports = React.createClass({

	propTypes: {
		scripts: ReactPropTypes.array,
		select: ReactPropTypes.string
	},

	_onSelectScript: function (scriptId) {
		Dispatcher.detailConfigScriptUpdate(scriptId);
	},

	render: function () {
		var scripts = this.props.scripts,
			select = this.props.select,
			selectTitle,
			configScriptViews;

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
		}

		return (
			<div className="panel panel-default">
			  <div className="panel-heading">
			  	<b>脚本预配置</b>
			  </div>
			  <div className="panel-body">
				<div className="btn-group" role="group">
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
			</div>
		);
	}
});