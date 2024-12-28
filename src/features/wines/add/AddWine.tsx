import { useLocation } from "preact-iso";
import { AddWineForm } from "./AddWineForm"
import { postWine } from "./postWine";
import { Values } from "./types"

export const AddWine = () => {
	const { route } = useLocation()

	const handleSubmit = async (values: Values) => {
		await postWine(values);
		route('/')
	}

	return (
		<AddWineForm handleSubmit={handleSubmit} />
	)
}
