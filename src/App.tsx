import { LocationProvider, Route, Router } from "preact-iso"
import { Wines } from "./features/wines/Wines"
import { AddWine } from "./features/wines/add/AddWine"
import { WineById } from "./features/wines/by-id/WineById"
import { Header } from "./features/header/Header"
import { Register } from "./features/register/Register"
import { Login } from "./features/login/Login"

export const App = () => {
	return (
		<div class="mx-auto max-w-screen-md p-4">
			<LocationProvider>
				<Header />
				<Router>
					<Route path="/" component={Wines} />
					<Route path="/new" component={AddWine} />
					<Route path="/register" component={Register} />
					<Route path="/login" component={Login} />
					<Route path="/:id" component={WineById} />
					<Route default component={Wines} />
				</Router>
			</LocationProvider>
		</div>
	)
}
