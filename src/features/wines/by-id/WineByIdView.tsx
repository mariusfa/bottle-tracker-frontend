import { FunctionalComponent } from "preact";
import { Wine as WineType } from "../types";
import { RoundedBoxContainer } from "../../../components/RoundedBoxContainer";
import { Heading1 } from "../../../components/Heading1";

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
		<RoundedBoxContainer>
			<Heading1 title={wine.name} />
			<p>WIP</p>
		</RoundedBoxContainer>
	)
}
