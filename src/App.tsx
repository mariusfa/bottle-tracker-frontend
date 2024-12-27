import { LocationProvider, Route, Router } from "preact-iso"
import { Wines } from "./features/wines/Wines"
import { AddWine } from "./features/wines/add/AddWine"

export const App = () => {
	return (
		<LocationProvider>
			<h1>Bottle tracker</h1>
			<Router>
				<Route path="/" component={Wines} />
				<Route path="/new" component={AddWine} />
				<Route default component={Wines} />
			</Router>
		</LocationProvider>
	)
}
