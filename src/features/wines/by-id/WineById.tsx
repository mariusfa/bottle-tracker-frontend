import { useSignal } from "@preact/signals"
import { Wine } from "../types"
import { useEffect } from "preact/hooks"
import { getWineById } from "./getWineById"
import { useRoute } from "preact-iso"
import { WineByIdView } from "./WineByIdView"

export const WineById = () => {
	const wine = useSignal<Wine>({ name: '', id: '' })
	const isLoading = useSignal(true)
	const isError = useSignal(false)
	const { params } = useRoute()

	useEffect(() => {
		const getWine = async () => {
			try {
				const data = await getWineById(params.id)
				wine.value = data
				isLoading.value = false
			} catch (error) {
				isLoading.value = false
				isError.value = true
			}
		}
		getWine()
	}, [])

	return (
		<WineByIdView wine={wine.value} isLoading={isLoading.value} isError={isError.value} />
	)
}
