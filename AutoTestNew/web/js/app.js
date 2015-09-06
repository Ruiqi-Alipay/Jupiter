var React = require('react'),
	Router = require('react-router'),
	DefaultRoute = Router.DefaultRoute,
	Route = Router.Route,
	RouteHandler = Router.RouteHandler,
	LoginPage = require('./pages/loginpage.react'),
	RegisterPage = require('./pages/registerpage.react'),
	Dashboard = require('./pages/dashboard.react');

var App = React.createClass({
	render: function () {
		return (
			<RouteHandler/>
		);
	}
});

var routes = (
	<Route handler={App}>
		<Route name='login' path='login' handler={LoginPage}/>
		<Route name='register' path='register' handler={RegisterPage}/>
		<Route name='dashboard' path='dashboard/:section_id' handler={Dashboard}/>
		<DefaultRoute handler={LoginPage}/>
	</Route>
);

Router.run(routes, Router.HashLocation, function (Root) {
	React.render(<Root/>, document.body);
});