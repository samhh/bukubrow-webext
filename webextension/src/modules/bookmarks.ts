import { ParsedInputResult } from 'Modules/parse-search-input';
import { formatRelative } from 'date-fns';
import { URLMatch } from 'Modules/compare-urls';
import { includesCaseInsensitive as includes } from 'Modules/string';

export interface LocalBookmarkWeighted extends LocalBookmark {
	weight: URLMatch;
}

export const filterBookmarks = (bookmarks: LocalBookmark[], test: ParsedInputResult) => bookmarks.filter((bookmark) => {
	if (!includes(bookmark.title, test.name)) return false;
	if (test.desc.some(d => !includes(bookmark.desc, d))) return false;
	if (test.url.some(u => !includes(bookmark.url, u))) return false;
	if (test.tags.some(t => !bookmark.tags.some(tag => includes(tag, t)))) return false;

	// ensure all wildcards match something
	const allWildcardsMatch = test.wildcard.every((wc) => {
		return (
			includes(bookmark.title, wc) ||
			includes(bookmark.desc, wc) ||
			includes(bookmark.url, wc) ||
			bookmark.tags.some(tag => includes(tag, wc))
		);
	});

	return allWildcardsMatch;
});

export const sortBookmarks = <T extends LocalBookmark & Partial<LocalBookmarkWeighted>>(a: T, b: T) => {
	const [aw, bw] = [a, b].map(bm => bm.weight || URLMatch.None);

	if (aw === bw) return a.title.localeCompare(b.title);
	if (aw === URLMatch.Exact) return -1;
	if (bw === URLMatch.Exact) return 1;
	if (aw === URLMatch.Domain) return -1;
	if (bw === URLMatch.Domain) return 1;
	return a.title.localeCompare(b.title);
};

const bukuDelimiter = ',';

export const transform = (bookmark: RemoteBookmark): LocalBookmark => ({
	id: bookmark.id,
	title: bookmark.metadata,
	// Buku uses commas as delimiters including at the start and end of the
	// string, so filter those out
	tags: bookmark.tags.split(bukuDelimiter).filter(tag => tag !== ''),
	url: bookmark.url,
	desc: bookmark.desc,
	flags: bookmark.flags,
});

export function untransform(bookmark: LocalBookmark): RemoteBookmark;
export function untransform(bookmark: LocalBookmarkUnsaved): RemoteBookmarkUnsaved;
export function untransform(bookmark: LocalBookmark | LocalBookmarkUnsaved):
RemoteBookmark | RemoteBookmarkUnsaved {
	const base: RemoteBookmarkUnsaved = {
		metadata: bookmark.title,
		tags: bukuDelimiter + bookmark.tags.join(bukuDelimiter) + bukuDelimiter,
		url: bookmark.url,
		desc: bookmark.desc,
		flags: bookmark.flags,
	};

	const transformed: RemoteBookmark | RemoteBookmarkUnsaved = 'id' in bookmark
		? { ...base, id: bookmark.id }
		: base;

	return transformed;
}

export const formatStagedBookmarksGroupTitle = (group: StagedBookmarksGroup) =>
	`${group.bookmarks.length} bookmark${group.bookmarks.length === 1 ? '' : 's'}, ${formatRelative(group.time, new Date())}`;
