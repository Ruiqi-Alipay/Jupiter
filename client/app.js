import 'babel/polyfill';
import Application from './components/Application';
import HomeRoute from './routes/HomeRoute';

React.render(
	<Relay.RootContainer
		Component={Application} route={new HomeRoute()}/>,
	document.getElementById('root')
);