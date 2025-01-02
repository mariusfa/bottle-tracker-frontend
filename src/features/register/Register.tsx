import { RegisterForm } from "./RegisterForm";
import { Values } from "./types";

export const Register = () => {

	const handleSubmit = async (values: Values) => {
		console.log(values);
	}

	return (
		<RegisterForm handleSubmit={handleSubmit} />
	);
}
