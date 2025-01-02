import { FunctionalComponent } from "preact";
import { Wine as WineType } from "../types";

interface Props {
	wine: WineType;
	isLoading: boolean;
	isError: boolean;
}

export const WineByIdView: FunctionalComponent<Props> =({ wine, isLoading, isError }) => {
	if (isLoading) {
		return <p>Loading...</p>
	}
	if (isError) {
		return <p>Something went wrong</p>
	}

	return (
		<div>
			<h1>{wine.name}</h1>
			<p>WIP</p>
		</div>
	)
}
