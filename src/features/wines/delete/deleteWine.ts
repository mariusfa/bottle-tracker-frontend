
const apiUrl = 'https://bottle-tracker-go-api-production.up.railway.app/wines'

export const deleteWine = async (id: string) => {
	const response = await fetch(`${apiUrl}/${id}`, {
		method: 'DELETE',
	})
	if (!response.ok) {
		throw new Error('Failed to delete wine')
	}
}
