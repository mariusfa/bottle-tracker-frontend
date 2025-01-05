import { FunctionalComponent } from "preact";
import { Values } from "./types";

interface Props {
	handleSubmit: (values: Values) => Promise<{ error: boolean; credentials: boolean }>;
}

export const LoginForm: FunctionalComponent<Props> = () => {
	return (
		<h1>LoginForm</h1>
	)
}
