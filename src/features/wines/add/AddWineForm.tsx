import { FunctionalComponent } from "preact";
import { Values } from "./types";
import { useSignal } from "@preact/signals";
import { RoundedBoxContainer } from "../../../components/RoundedBoxContainer";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { InputText } from "../../../components/InputText";
import { Label } from "../../../components/Label";
import { Heading1 } from "../../../components/Heading1";
import { useEffect, useRef } from "preact/hooks";

interface Props {
	handleSubmit: (values: Values) => void;
}

export const AddWineForm: FunctionalComponent<Props> = ({ handleSubmit }) => {
	const formValues = useSignal<Values>({ name: "" });
	const inputRef = useRef<HTMLInputElement>(null);

	const handleOnChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		formValues.value = { ...formValues.value, [target.name]: target.value };
	}

	const onSubmit = (e: Event) => {
		e.preventDefault();
		handleSubmit(formValues.value);
	}

	useEffect(() => {
		if (inputRef && inputRef.current) {
			inputRef.current.focus();
		}
	}, [])

	return (
		<RoundedBoxContainer>
			<Heading1 title="Add wine" />
			<form onSubmit={onSubmit}>
				<Label label="Name" forInput="name" />
				<InputText placeholder="Name" name="name" value={formValues.value.name} onChange={handleOnChange} inputRef={inputRef}/>
				<PrimaryButton label="Add wine" type="submit" />
			</form>
		</RoundedBoxContainer>
	)
}
