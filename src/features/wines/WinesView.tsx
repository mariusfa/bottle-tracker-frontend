import { FunctionalComponent, } from "preact";
import { Wine } from "./types";
import { RoundedBoxContainer } from "../../components/RoundedBoxContainer";
import { Heading1 } from "../../components/Heading1";
import { LinkText } from "../../components/LinkText";
import { DestroyButton } from "../../components/DestroyButton";

interface Props {
	wines: Wine[];
	deleteWine: (id: string) => void;
}

export const WinesView: FunctionalComponent<Props> = ({ wines, deleteWine }) => {
	return (
		<RoundedBoxContainer >
		<div class="flex justify-between">
			<Heading1 title="Wines" />
			<LinkText href="/new">New wine</LinkText>
		</div>
			<ul class="mt-2">
				{wines.map(wine => (
					<li class="flex justify-between my-2" key={wine.id}>
						<a class="text-lg" href={`/${wine.id}`}>{wine.name}</a>
						<DestroyButton onClick={() => deleteWine(wine.id)} label="Delete"/>
					</li>
				))}
			</ul>
		</RoundedBoxContainer>
	)
}
