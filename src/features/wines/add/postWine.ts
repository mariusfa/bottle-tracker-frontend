import { Values } from "./types"

const apiUrl = 'https://bottle-tracker-go-api-production.up.railway.app/wines'

export const postWine = async (values: Values) => {
	const response = await fetch(apiUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(values),
	})
	if (!response.ok) {
		throw new Error('Failed to add wine')
	}
}
