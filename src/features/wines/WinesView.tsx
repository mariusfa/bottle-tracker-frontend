import { FunctionalComponent, } from "preact";
import { Wine } from "./types";

interface Props {
	wines: Wine[];
	addWine: () => void;
	deleteWine: (id: string) => void;
}

export const WinesView: FunctionalComponent<Props> = ({ wines, addWine, deleteWine }) => {
	return (
		<>
			<button onClick={addWine}>New wine</button>
			<ul>
				{wines.map(wine => (
					<li key={wine.id}>
						<span>{wine.name}</span>
						<button onClick={() => deleteWine(wine.id)}>Delete</button>
					</li>
				))}
			</ul>
		</>
	)
}
