import { FunctionalComponent } from "preact";
import { Values } from "./types";
import { useSignal } from "@preact/signals";

interface Props {
	handleSubmit: (values: Values) => void;
}

export const AddWineForm: FunctionalComponent<Props> = ({ handleSubmit }) => {
	const formValues = useSignal<Values>({ name: "" });

	const handleOnChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		formValues.value = { ...formValues.value, [target.name]: target.value };
	}

	const onSubmit = (e: Event) => {
		e.preventDefault();
		handleSubmit(formValues.value);
	}

	return (
		<form onSubmit={onSubmit}>
			<label class="block" for="name">Name</label>
			<input class="block" id="name" name="name" type="text" value={formValues.value.name} onChange={handleOnChange} />
			<button class="block" type="submit">Add wine</button>
		</form>
	)
}
