import { FunctionalComponent, } from "preact";
import { Wine } from "./types";

interface Props {
	wines: Wine[];
}

export const WinesView: FunctionalComponent<Props> = ({ wines }) => {
	return (
		<ul>
			{wines.map(wine => (
				<li key={wine.name}>{wine.name}</li>
			))}
		</ul>

	)
}
