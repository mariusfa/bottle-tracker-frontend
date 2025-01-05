import { login } from "./login";
import { LoginForm } from "./LoginForm";
import { Values } from "./types";

export const Login = () => {
	const handleSubmit = async (values: Values) => {
		try {
			await login(values);
		} catch (error) {
			if (error instanceof Error && error.message === 'Unauthorized') {
				return { error: false, credentials: true };
			} else {
				return { error: true, credentials: false };
			}
		}
		return { error: false, credentials: false };
	}

	return (
		<LoginForm handleSubmit={handleSubmit} />
	)
}

