import { domain, hrefSansProtocol } from '~/modules/url';

describe('~/modules/url', () => {
	test('domain', () => {
		expect(domain(new URL('http://www.samhh.com'))).toEqual('samhh.com');
		expect(domain(new URL('https://vvv.www.samhh.com'))).toEqual('samhh.com');
		expect(domain(new URL('http://samhh.com/abc'))).toEqual('samhh.com');
	});

	test('hrefSansProtocol', () => {
		expect(hrefSansProtocol(new URL('https://samhh.com'))).toEqual('samhh.com/');
		expect(hrefSansProtocol(new URL('http://samhh.com/a/path.html'))).toEqual('samhh.com/a/path.html');
		expect(hrefSansProtocol(new URL('https://subdomain.samhh.com/some/other/path'))).toEqual('subdomain.samhh.com/some/other/path');
	});
});

