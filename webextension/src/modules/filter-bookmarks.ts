import check from 'Modules/string-includes-case-insensitive';
import { ParsedInputResult } from 'Modules/parse-search-input';

const filterBookmarks = (bookmarks: LocalBookmark[], test: ParsedInputResult) => bookmarks.filter((bookmark) => {
	if (!check(bookmark.title, test.name)) return false;
	if (test.desc.some(d => !check(bookmark.desc, d))) return false;
	if (test.url.some(u => !check(bookmark.url, u))) return false;
	if (test.tags.some(t => !bookmark.tags.some(tag => check(tag, t)))) return false;

	// ensure all wildcards match something
	const allWildcardsMatch = test.wildcard.every((wc) => {
		return (
			check(bookmark.title, wc) ||
			check(bookmark.desc, wc) ||
			check(bookmark.url, wc) ||
			bookmark.tags.some(tag => check(tag, wc))
		);
	});

	return allWildcardsMatch;
});

export default filterBookmarks;
