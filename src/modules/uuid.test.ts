import uuid from 'Modules/uuid';

describe('uuid', () => {
	test('generates unique ids', () => {
		let vals: number[] = [];

		for (let i = 0; i < 100; i++) {
			vals.push(uuid([1], 2));
		}

		expect(vals).not.toContain(1);
	});
});
