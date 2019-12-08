import { ordNumber, contramap } from 'fp-ts/lib/Ord';
import { endIndexOfAnyOf } from 'Modules/string';

export enum URLMatch {
	Exact = 'exact',
	Domain = 'domain',
	None = 'none',
}

/**
 * Compare two URLs and determine similarity.
 */
export const match = (x: URL) => (y: URL): URLMatch => {
	const http = ['http:', 'https:'];

	// Never match URLs with non-HTTP(S) protocols
	if ([x.protocol, y.protocol].some(protocol => !http.includes(protocol))) return URLMatch.None;

	if (
		x.href === y.href ||
		// Match URLs as exact even if one is HTTP protocol and the other HTTPS
		// eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
		x.href.substring(endIndexOfAnyOf(x.href, http)) === y.href.substring(endIndexOfAnyOf(y.href, http))
	) return URLMatch.Exact;

	if (x.hostname === y.hostname) return URLMatch.Domain;

	// Match subdomain. Note that this will in exceptionally rare circumstances
	// lead to a false positive
	if (
		(x.hostname.endsWith(y.hostname) && x.hostname[x.hostname.length - y.hostname.length - 1] === '.') ||
		(y.hostname.endsWith(x.hostname) && y.hostname[y.hostname.length - x.hostname.length - 1] === '.')
	) return URLMatch.Domain;

	return URLMatch.None;
};

export const ordURLMatch = contramap<number, URLMatch>((x) => {
	switch (x) {
		case URLMatch.Exact: return 2;
		case URLMatch.Domain: return 1;
		case URLMatch.None: return 0;
	}
})(ordNumber);

