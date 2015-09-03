export default class extends Relay.Route {
	static path = '/';
	static queries = {
		app: (Component) => Relay.QL`
			query RootQuery {
				app {
					${Component.getFragment('app')}
				}
			}
		`
	};
	static paramDefinitions = {

	};
	static routeName = 'HomeRoute';
}