export const createTagPath = ([x, y]: Pos): Paths => [
	[x - 5, y - 5], [x + 5, y - 5], [x + 5, y + 5], [x - 5, y + 5]
]