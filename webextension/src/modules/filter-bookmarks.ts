import stringIncludesCaseInsensitive from 'Modules/string-includes-case-insensitive';
import { ParsedInputResult } from 'Modules/parse-search-input';

const filterBookmarks = (bookmarks: LocalBookmark[], test: ParsedInputResult) => bookmarks.filter((bookmark) => {
	if (!stringIncludesCaseInsensitive(bookmark.title, test.name)) return false;
	if (test.desc.some(d => !stringIncludesCaseInsensitive(bookmark.desc, d))) return false;
	if (test.url.some(u => !stringIncludesCaseInsensitive(bookmark.url, u))) return false;
	if (test.tags.some(t => !bookmark.tags.some(bt => stringIncludesCaseInsensitive(bt, t)))) return false;

	return true;
});

export default filterBookmarks;
