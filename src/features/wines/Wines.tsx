import { useSignal } from "@preact/signals"
import { Wine } from "./types"
import { WinesView } from "./WinesView"
import { useEffect } from "preact/hooks"
import { useLocation } from "preact-iso"
import { FunctionalComponent } from "preact"
import { deleteWine } from "./delete/deleteWine"

const apiUrl = 'https://bottle-tracker-go-api-production.up.railway.app/wines'

export const Wines: FunctionalComponent = () => {
	const wines = useSignal<Wine[]>([])
	const shouldFetch = useSignal(true)
	const { route } = useLocation()

	useEffect(() => {
		const getWines = async () => {
			const response = await fetch(apiUrl)
			const data = await response.json()
			wines.value = data
			shouldFetch.value = false
		}
		if (shouldFetch.value) {
			getWines()
		}
	}, [shouldFetch.value])

	const addWine = () => {
		route('/new')
	}

	const handleDelete = async (id: string) => {
		await deleteWine(id)
		shouldFetch.value = true
	}

	return (
		<WinesView wines={wines.value} addWine={addWine} deleteWine={handleDelete} />
	)
}
