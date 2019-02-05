export const random = (start: number, end: number) => Math.random() * (end - start) + start;

export const randomInteger = (start: number, end: number) => Math.round(random(start, end));

// this function is not pure function
export const shuffleList = (list: any[]) => {
	const maxIndex = list.length - 1;
	for (let i = 0; i < list.length; i++) {
		const exchangeIndex = randomInteger(0, maxIndex);
		[list[i], list[exchangeIndex]] = [list[exchangeIndex], list[i]];
	}
}

export const randomOptions = <T>(...options: T[]): T => options[randomInteger(0, options.length - 1)];
