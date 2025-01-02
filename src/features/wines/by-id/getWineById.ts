
const apiUrl = 'https://bottle-tracker-go-api-production.up.railway.app/wines'

export const getWineById = async (id: string) => {
	const response = await fetch(`${apiUrl}/${id}`)
	if (!response.ok) {
		throw new Error('Failed to get wine')
	}
	return response.json()
}
