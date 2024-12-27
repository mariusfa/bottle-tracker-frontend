import { AddWineForm } from "./AddWineForm"
import { postWine } from "./postWine";
import { Values } from "./types"

export const AddWine = () => {
	const handleSubmit = async (values: Values) => {
		console.log(values);
		await postWine(values);
	}

	return (
		<AddWineForm handleSubmit={handleSubmit} />
	)
}
