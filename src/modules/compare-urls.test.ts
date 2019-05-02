import compareURLs, { URLMatch } from 'Modules/compare-urls';

describe('compare URLs', () => {
	test('matches exact URL', () => {
		const url1 = new URL('https://samhh.com');
		const url2 = new URL('https://samhh.com/');
		expect(compareURLs(url1, url2)).toBe(URLMatch.Exact);
	});

	test('matches exact URL even if HTTP(S) protocol differs', () => {
		const url1 = new URL('https://samhh.com');
		const url2 = new URL('http://samhh.com/');
		expect(compareURLs(url1, url2)).toBe(URLMatch.Exact);
	});

	test('matches domain', () => {
		const url1 = new URL('https://samhh.com');
		const url2 = new URL('https://samhh.com/1/2/3');
		expect(compareURLs(url1, url2)).toBe(URLMatch.Domain);
	});

	test('matches subdomain as domain', () => {
		const url1 = new URL('https://samhh.co.uk');
		const url2 = new URL('https://sub.domain.samhh.co.uk');
		expect(compareURLs(url1, url2)).toBe(URLMatch.Domain);
	});

	test('does not match different domain', () => {
		const url1 = new URL('https://samhh.com');
		const url2 = new URL('https://duckduckgo.com');
		expect(compareURLs(url1, url2)).toBe(URLMatch.None);
	});

	test('does not match different TLD', () => {
		const url1 = new URL('https://samhh.com');
		const url2 = new URL('https://samhh.co.uk');
		expect(compareURLs(url1, url2)).toBe(URLMatch.None);
	});

	test('does not match URL if (non-HTTP(S)) protocols differ', () => {
		const url1 = new URL('https://samhh.com');
		const url2 = new URL('ftp://samhh.com/');
		expect(compareURLs(url1, url2)).toBe(URLMatch.None);

		const url3 = new URL('ssh://samhh.com/');
		const url4 = new URL('ftp://samhh.com');
		expect(compareURLs(url3, url4)).toBe(URLMatch.None);
	});
});
