import ensureValidURL from 'Modules/ensure-valid-url';

describe('ensure valid URL', () => {
	test('return untouched valid URLs', () => {
		expect(ensureValidURL('http://samhh.com')).toBe('http://samhh.com');
		expect(ensureValidURL('http://www.samhh.com')).toBe('http://www.samhh.com');
		expect(ensureValidURL('https://samhh.com')).toBe('https://samhh.com');
		expect(ensureValidURL('https://blog.samhh.com')).toBe('https://blog.samhh.com');
	});

	test('return amended invalid URLs', () => {
		expect(ensureValidURL('samhh.com')).toBe('http://samhh.com');
		expect(ensureValidURL('www.samhh.com')).toBe('http://www.samhh.com');
	});
});
