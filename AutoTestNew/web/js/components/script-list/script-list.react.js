var React = require('react'),
    ReactPropTypes = React.PropTypes,
    ScriptListItem = require('./script-list-item.react');

module.exports = React.createClass({

    propTypes: {
        scripts: ReactPropTypes.array,
        searchText: ReactPropTypes.string
    },

    render: function () {
        var scripts = this.props.scripts,
            searchText = this.props.searchText,
            scriptsListItems;

        if (scripts) {
            scriptsListItems = scripts.filter(function (element) {
                if (!searchText || searchText.length == 0 || element.title.indexOf(searchText) >= 0) {
                    return true
                }
            }).map(function (script) {
                return (<ScriptListItem key={script.id} script={script}/>);
            });
        }

        return (
            <div className="panel panel-default">
                <ul className='list-group'>
                    {scriptsListItems}
                </ul>
            </div>
        );
    }
});