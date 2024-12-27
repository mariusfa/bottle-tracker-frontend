import { LocationProvider, Route, Router } from "preact-iso"
import { Wines } from "./features/wines/Wines"

export const App = () => {
	return (
		<LocationProvider>
			<h1>Bottle tracker</h1>
			<Router>
				<Route path="/" component={Wines} />
				<Route path="/new" component={Wines} />
				<Route default component={Wines} />
			</Router>
		</LocationProvider>
	)
}
