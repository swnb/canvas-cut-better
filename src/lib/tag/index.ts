export const createTagPath = ([x, y]: Point): Path => [
	[x - 5, y - 5], [x + 5, y - 5], [x + 5, y + 5], [x - 5, y + 5]
]
