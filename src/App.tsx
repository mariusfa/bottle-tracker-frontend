import { LocationProvider } from "preact-iso"
import { Wines } from "./features/wines/Wines"

export const App = () => {
	return (
		<LocationProvider>
			<h1>Bottle tracker</h1>
			<Wines />
		</LocationProvider>
	)
}
