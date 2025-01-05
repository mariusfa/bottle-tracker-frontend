import { FunctionalComponent } from "preact";
import { Values } from "./types";
import { RoundedBoxContainer } from "../../components/RoundedBoxContainer";
import { useSignal } from "@preact/signals";
import { Heading1 } from "../../components/Heading1";
import { Label } from "../../components/Label";
import { InputText } from "../../components/InputText";
import { useEffect, useRef } from "preact/hooks";
import { PrimaryButton } from "../../components/PrimaryButton";
import { LinkText } from "../../components/LinkText";

interface Props {
	handleSubmit: (values: Values) => Promise<{ error: boolean, conflict: boolean }>;
}

export const RegisterForm: FunctionalComponent<Props> = ({ handleSubmit }) => {
	const formValues = useSignal<Values>({ name: "", password: "", passwordConfirmation: "" });
	const formErrors = useSignal({ name: "", password: "", passwordConfirmation: "" });
	const generalError = useSignal(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const isSuccess = useSignal(false);

	const validateForm = (values: Values) => {
		const errors = { name: "", password: "", passwordConfirmation: "" };
		if (!values.name) {
			errors.name = "Name is required";
		}
		if (!values.password) {
			errors.password = "Password is required";
		}
		if (!values.passwordConfirmation) {
			errors.passwordConfirmation = "Password confirmation is required";
		}
		if (values.password !== values.passwordConfirmation) {
			errors.password = "Passwords do not match";
			errors.passwordConfirmation = "Passwords do not match";
		}
		return errors;
	}

	const handleOnChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		formValues.value = { ...formValues.value, [target.name]: target.value };
		formErrors.value = { name: "", password: "", passwordConfirmation: "" };
		generalError.value = false;
	}

	const onSubmit = async (e: Event) => {
		e.preventDefault();
		const errors = validateForm(formValues.value);
		if (errors.name || errors.password || errors.passwordConfirmation) {
			formErrors.value = errors;
			return;
		}

		const error = await handleSubmit(formValues.value);
		if (error.conflict) {
			formErrors.value = { ...formErrors.value, name: "Name already exists" };
			return
		}
		if (error.error) {
			generalError.value = true;
			return
		}
		isSuccess.value = true;
	}

	useEffect(() => {
		if (inputRef && inputRef.current) {
			inputRef.current.focus();
		}
	}, [])

	if (isSuccess.value) {
		return (
			<RoundedBoxContainer md={true}>
				<Heading1 title="Register" />
				<p class="text-green-600 text-xs italic">Successfully registered.</p>
				<LinkText href="/login">Click here to login</LinkText>
			</RoundedBoxContainer>
		);
	}

	return (
		<RoundedBoxContainer md={true}>
			<Heading1 title="Register" />
			{generalError.value && <p class="text-red-500 text-xs italic">Failed to register.</p>}
			<form onSubmit={onSubmit}>
				<Label label="Name" forInput="name" />
				<InputText placeholder="Name" name="name" value={formValues.value.name} type="text" onChange={handleOnChange} inputRef={inputRef} />
				{formErrors.value.name && <p class="text-red-500 text-xs italic">{formErrors.value.name}</p>}
				<Label label="Password" forInput="password" />
				<InputText placeholder="Password" name="password" value={formValues.value.password} type="password" onChange={handleOnChange} />
				{formErrors.value.password && <p class="text-red-500 text-xs italic">{formErrors.value.password}</p>}
				<Label label="Password confirmation" forInput="passwordConfirmation" />
				<InputText placeholder="Password confirmation" name="passwordConfirmation" value={formValues.value.passwordConfirmation} type="password" onChange={handleOnChange} />
				{formErrors.value.passwordConfirmation && <p class="text-red-500 text-xs italic">{formErrors.value.passwordConfirmation}</p>}
				<PrimaryButton label="Submit" type="submit" />
			</form>
		</RoundedBoxContainer>
	);
}
