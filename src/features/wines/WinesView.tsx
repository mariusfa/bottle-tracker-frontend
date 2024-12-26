import { FunctionalComponent, } from "preact";
import { Wine } from "./types";

interface Props {
	wines: Wine[];
	addWine: () => void;
}

export const WinesView: FunctionalComponent<Props> = ({ wines, addWine }) => {
	return (
		<>
			<button onClick={addWine}>Add wine</button>
			<ul>
				{wines.map(wine => (
					<li key={wine.name}>{wine.name}</li>
				))}
			</ul>
		</>
	)
}
