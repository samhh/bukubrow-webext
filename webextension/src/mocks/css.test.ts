import cssMock from './css';

describe('css mock', () => {
	test('always returns requested property name as value', () => {
		expect(cssMock.abc).toEqual('abc');
		expect(cssMock[123]).toEqual('123');
	});
});
