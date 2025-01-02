
export const Header = () => {
	return (
		<header class="flex justify-between mb-4 rounded bg-white shadow-md p-4">
			<a class="text-blue-600 text-lg font-bold" href="/">Bottle tracker</a>
			<nav class="space-x-4">
				<a href="/storage" class="text-blue-600">Storage</a>
				<a href="/tasted" class="text-blue-600">Tasted</a>
				<button class="text-blue-600">Log out</button>
			</nav>
		</header>
	)
}
