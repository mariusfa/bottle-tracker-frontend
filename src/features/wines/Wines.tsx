import { Wine } from "./types"
import { WinesView } from "./WinesView"

export const Wines = () => {
	const wines: Wine[] = [
		{
			name: 'Chardonnay',
		},
		{
			name: 'Merlot',
		},
		{
			name: 'Cabernet Sauvignon',
		},
	]

	return (
		<WinesView wines={wines} />
	)
}
