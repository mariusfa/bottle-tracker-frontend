import { useSignal } from "@preact/signals"
import { Wine } from "./types"
import { WinesView } from "./WinesView"
import { useEffect } from "preact/hooks"

const apiUrl = 'https://bottle-tracker-go-api-production.up.railway.app/wines'

export const Wines = () => {
	const wines = useSignal<Wine[]>([])

	useEffect(() => {
		const getWines = async () => {
			const response = await fetch(apiUrl)
			const data = await response.json()
			wines.value = data
		}
		getWines()
	}, [])

	return (
		<WinesView wines={wines.value} />
	)
}
