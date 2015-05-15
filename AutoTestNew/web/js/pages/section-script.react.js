var React = require('react'),
	ReactPropTypes = React.PropTypes,
	FolderHeader = require('../components/folder-list/folder-header.react'),
	FolderList = require('../components/folder-list/folder-list.react'),
	ScriptList = require('../components/script-list/script-list.react'),
	CreateConsole = require('../components/folder-console/create.react'),
	EditConsole = require('../components/folder-console/edit.react'),
	SearchConsole = require('../components/folder-console/search.react');

function findArrayIndex (items, id) {
	for (var index in items) {
		if (items[index].id == id) {
			return index;
		}
	}
}

module.exports = React.createClass({

	propTypes: {
		folders: ReactPropTypes.array,
		scripts: ReactPropTypes.array,
		selectFolderId: ReactPropTypes.string,
		editTitle: ReactPropTypes.string,
		searchText: ReactPropTypes.string
	},

	render: function () {
		var props = this.props,
			selectFolderId = props.selectFolderId,
			selectFolder,
			consoleView;

		if (props.folders && props.selectFolderId) {
			var index = findArrayIndex(props.folders, props.selectFolderId);
			selectFolder = props.folders[index];
		}

		if (props.editTitle && selectFolderId) {
			consoleView = <EditConsole selectFolderId={selectFolderId} editTitle={props.editTitle}/>;
		} else if (selectFolderId) {
			consoleView = <SearchConsole selectFolder={selectFolder} searchText={props.searchText}/>;
		} else {
			consoleView = <CreateConsole/>
		}

		return (
			<div className='row'>
				<div className='col-sm-3 col-sm-offset-1'>
					<FolderHeader/>
					<FolderList folders={props.folders} selectFolderId={selectFolderId}/>
				</div>
				<div className='col-sm-7'>
					{consoleView}
					<ScriptList scripts={props.scripts} searchText={this.props.searchText}/>
				</div>
			</div>
		);
	}
});