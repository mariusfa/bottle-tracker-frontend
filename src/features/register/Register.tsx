import { register } from "./register";
import { RegisterForm } from "./RegisterForm";
import { Values } from "./types";

export const Register = () => {

	const handleSubmit = async (values: Values) => {
		try {
			await register(values);
		} catch (error) {
			if (error instanceof Error && error.message === 'Name already exists') {
				return { error: false, conflict: true };
			} else {
				return { error: true, conflict: false };
			}
		}

		return { error: false, conflict: false };
	}

	return (
		<RegisterForm handleSubmit={handleSubmit} />
	);
}
