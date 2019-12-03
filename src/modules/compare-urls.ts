import { endIndexOfAnyOf } from 'Modules/string';

export enum URLMatch {
	Exact = 'exact',
	Domain = 'domain',
	None = 'none',
}

/**
 * Compare two URLs and determine similarity.
 */
const compareURLs = (url1: URL, url2: URL): URLMatch => {
	const http = ['http:', 'https:'];

	// Never match URLs with non-HTTP(S) protocols
	if ([url1.protocol, url2.protocol].some(protocol => !http.includes(protocol))) return URLMatch.None;

	if (
		url1.href === url2.href ||
		// Match URLs as exact even if one is HTTP protocol and the other HTTPS
		// eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
		url1.href.substring(endIndexOfAnyOf(url1.href, http)) === url2.href.substring(endIndexOfAnyOf(url2.href, http))
	) return URLMatch.Exact;

	if (url1.hostname === url2.hostname) return URLMatch.Domain;

	// Match subdomain. Note that this will in exceptionally rare circumstances
	// lead to a false positive
	if (
		(url1.hostname.endsWith(url2.hostname) && url1.hostname[url1.hostname.length - url2.hostname.length - 1] === '.') ||
		(url2.hostname.endsWith(url1.hostname) && url2.hostname[url2.hostname.length - url1.hostname.length - 1] === '.')
	) return URLMatch.Domain;

	return URLMatch.None;
};

export default compareURLs;

