import { shuffleList } from "./rand";

const createList = (size: number) => {
	const arr = new Array(size);
	for (let i = 0; i < size; i++) {
		arr[i] = i + 1;
	}
	return arr;
}

it('random shuffle', () => {
	const list = createList(10);
	shuffleList(list);
	expect(list.length).toBe(10);
	global.console.log(list);
})
