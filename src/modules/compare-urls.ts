import { flow, not } from 'fp-ts/lib/function';
import { ordNumber, contramap } from 'fp-ts/lib/Ord';
import { eqString } from 'fp-ts/lib/Eq';
import { equal, mapBoth } from 'Modules/tuple'
import { some } from 'Modules/array';
import { hrefSansProtocol, isHttpOrHttps, domain } from 'Modules/url';

export enum URLMatch {
	Exact = 'exact',
	Domain = 'domain',
	None = 'none',
}

const eqS = equal(eqString);
const eqHref = flow(mapBoth(hrefSansProtocol), eqS);
const eqDomain = flow(mapBoth(domain), eqS);

/**
 * Compare two URLs and determine similarity.
 */
export const match = (x: URL) => (y: URL): URLMatch => {
	const zs: [URL, URL] = [x, y];

	// Never match URLs with non-HTTP(S) protocols
	if (some(not(isHttpOrHttps))(zs)) return URLMatch.None;

	// Match URLs as exact irrespective of protocol equality
	if (eqHref(zs)) return URLMatch.Exact;

	// Check equality of domain (ignoring subdomain(s))
	if (eqDomain(zs)) return URLMatch.Domain;

	return URLMatch.None;
};

export const ordURLMatch = contramap<number, URLMatch>((x) => {
	switch (x) {
		case URLMatch.Exact: return 0
		case URLMatch.Domain: return 1;
		case URLMatch.None: return 2;
	}
})(ordNumber);

