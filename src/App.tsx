import { LocationProvider, Route, Router } from "preact-iso"
import { Wines } from "./features/wines/Wines"
import { AddWine } from "./features/wines/add/AddWine"
import { WineById } from "./features/wines/by-id/WineById"

export const App = () => {
	return (
		<LocationProvider>
			<a class="block" href="/">Bottle tracker</a>
			<Router>
				<Route path="/" component={Wines} />
				<Route path="/new" component={AddWine} />
				<Route path="/:id" component={WineById} />
				<Route default component={Wines} />
			</Router>
		</LocationProvider>
	)
}
