import filterBookmarks from 'Modules/filter-bookmarks';
import { ParsedInputResult } from 'Modules/parse-search-input';

const coolBookmark: LocalBookmark = {
	id: 0,
	title: 'Cool bookmark',
	desc: 'Some other words',
	url: 'https://duckduckgo.com',
	tags: ['awesome', 'supreme'],
	flags: 0,
};

const superBookmark: LocalBookmark = {
	id: 42,
	title: 'Super duper website. Awesome',
	desc: 'Legitimately fantastic',
	url: 'https://blog.samhh.com',
	tags: ['impeccable'],
	flags: 1,
};

const incredibleBookmark: LocalBookmark = {
	id: 1337,
	title: 'Incredibly excellent',
	desc: 'Truly outstanding and duper awesome',
	url: 'http://www.samhh.com',
	tags: ['great', 'superb'],
	flags: 20,
};

const unstoppableBookmark: LocalBookmark = {
	id: 99999,
	title: 'Unstoppable',
	desc: '',
	url: 'https://samhh.com/awesome',
	tags: [],
	flags: 999,
};

const allBookmarks = [coolBookmark, superBookmark, incredibleBookmark, unstoppableBookmark];
const emptyParsedInput: ParsedInputResult = {
	name: '',
	desc: [],
	url: [],
	tags: [],
};

describe('filter bookmarks with parsed input case insensitively', () => {
	test('filter by title', () => {
		const titleFilter = filterBookmarks(allBookmarks, {
			...emptyParsedInput,
			name: 'awesome',
		});

		const expectedTitleResult = [superBookmark];
		expect(titleFilter).toMatchObject(expectedTitleResult);
	});

	test('filter by url', () => {
		const urlFilter = filterBookmarks(allBookmarks, {
			...emptyParsedInput,
			url: ['samhh.com'],
		});

		const expectedUrlResult = [superBookmark, incredibleBookmark, unstoppableBookmark];
		expect(urlFilter).toMatchObject(expectedUrlResult);
	});
});
