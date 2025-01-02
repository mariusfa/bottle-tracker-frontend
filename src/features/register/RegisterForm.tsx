import { FunctionalComponent } from "preact";
import { Values } from "./types";
import { RoundedBoxContainer } from "../../components/RoundedBoxContainer";
import { useSignal } from "@preact/signals";
import { Heading1 } from "../../components/Heading1";
import { Label } from "../../components/Label";
import { InputText } from "../../components/InputText";
import { useEffect, useRef } from "preact/hooks";
import { PrimaryButton } from "../../components/PrimaryButton";

interface Props {
	handleSubmit: (values: Values) => void;
}

export const RegisterForm: FunctionalComponent<Props> = ({ handleSubmit }) => {
	const formValues = useSignal<Values>({ name: "", password: "", passwordConfirmation: "" });
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
		<RoundedBoxContainer md={true}>
			<Heading1 title="Register"/>
			<form onSubmit={onSubmit}>
				<Label label="Name" forInput="name" />
				<InputText placeholder="Name" name="name" value={formValues.value.name} onChange={handleOnChange} inputRef={inputRef}/>
				<Label label="Password" forInput="password" />
				<InputText placeholder="Password" name="password" value={formValues.value.password} onChange={handleOnChange}/>
				<Label label="Password confirmation" forInput="passwordConfirmation" />
				<InputText placeholder="Password confirmation" name="passwordConfirmation" value={formValues.value.passwordConfirmation} onChange={handleOnChange}/>
				<PrimaryButton label="Submit" type="submit" />
			</form>
		</RoundedBoxContainer>
	);
}
