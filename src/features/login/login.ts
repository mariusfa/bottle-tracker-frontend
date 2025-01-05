import { Values } from "./types"

const apiUrl = 'https://bottle-tracker-go-api-production.up.railway.app/users/login'

export const login = async (values: Values) => {
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
	if (response.status === 401) {
		throw new Error('Unauthorized')
	}
	if (!response.ok) {
		throw new Error('Failed to login')
	}
}
