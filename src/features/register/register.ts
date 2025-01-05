import { Values } from "./types"

const apiUrl = 'https://bottle-tracker-go-api-production.up.railway.app/users/register'

export const register = async (values: Values) => {
	const response = await fetch(apiUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name: values.name,
			password: values.password,
		}),
	})
	if (response.status === 409) {
		throw new Error('Name already exists')
	}
	if (!response.ok) {
		throw new Error('Failed to add wine')
	}
}
