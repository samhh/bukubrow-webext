import { endIndexOfAnyOf } from 'Modules/string';

export enum URLMatch {
	Exact = 'exact',
	Domain = 'domain',
	None = 'none',
}

const mapURLToActiveTabMatch = (url1: URL, url2: URL) => {
	const http = ['http:', 'https:'];

	// Never match URLs with non-HTTP(S) protocols
	if ([url1.protocol, url2.protocol].some(protocol => !http.includes(protocol))) return URLMatch.None;

	if (
		url1.href === url2.href ||
		// Match URLs as exact even if one is HTTP protocol and the other HTTPS
		url1.href.substring(endIndexOfAnyOf(url1.href, http)) === url2.href.substring(endIndexOfAnyOf(url2.href, http))
	) return URLMatch.Exact;

	if (url1.hostname === url2.hostname) return URLMatch.Domain;

	return URLMatch.None;
};

export default mapURLToActiveTabMatch;
