import { FunctionalComponent, } from "preact";
import { Wine } from "./types";

interface Props {
	wines: Wine[];
	deleteWine: (id: string) => void;
}

export const WinesView: FunctionalComponent<Props> = ({ wines, deleteWine }) => {
	return (
		<>
			<a href="/new">New wine</a>
			<ul>
				{wines.map(wine => (
					<li key={wine.id}>
						<a href={`/${wine.id}`}>{wine.name}</a>
						<button onClick={() => deleteWine(wine.id)}>Delete</button>
					</li>
				))}
			</ul>
		</>
	)
}
