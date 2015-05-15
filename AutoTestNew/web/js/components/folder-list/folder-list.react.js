var React = require('react'),
	ReactPropTypes = React.PropTypes,
	FolderListItem = require('./folder-list-item.react');

module.exports = React.createClass({

	propTypes: {
		selectFolderId: ReactPropTypes.string,
		folders: ReactPropTypes.array
	},

	render: function () {
		var styles = {
			list: {
				'overflowY': 'auto',
				'maxHeight': '500px'
			}
		};
		var props = this.props;

		var folderItemViews = '';
		if (props.folders) {
			folderItemViews = props.folders.map(function (folder) {
				return (
					<FolderListItem
						key={folder.id}
						folder={folder}
						select={props.selectFolderId == folder.id}/>
				);
			});
		}

		return (
			<div className="panel panel-default" style={styles.list}>
				<ul className='list-group'>
					{folderItemViews}
				</ul>
			</div>
		);
	}
});