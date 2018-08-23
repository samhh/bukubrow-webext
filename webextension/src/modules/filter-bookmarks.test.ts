import filterBookmarks from './filter-bookmarks';

const coolBookmark: LocalBookmark = {
	id: 0,
	title: 'Cool bookmark',
	desc: 'Some other words',
	url: 'https://samhh.com',
	tags: new Set(['awesome', 'supreme']),
	flags: 0,
};

const superBookmark: LocalBookmark = {
	id: 42,
	title: 'Super duper website. Awesome',
	desc: 'Legitimately fantastic',
	url: 'https://blog.samhh.com',
	tags: new Set(['impeccable']),
	flags: 1,
};

const incredibleBookmark: LocalBookmark = {
	id: 1337,
	title: 'Incredibly excellent',
	desc: 'Truly outstanding and duper awesome',
	url: 'http://www.samhh.com',
	tags: new Set(['great', 'superb']),
	flags: 20,
};

const unstoppableBookmark: LocalBookmark = {
	id: 99999,
	title: 'Unstoppable',
	desc: '',
	url: 'https://samhh.com/awesome',
	tags: new Set(),
	flags: 999,
};

const bookmarks = [coolBookmark, superBookmark, incredibleBookmark, unstoppableBookmark];

test('filter bookmarks, ordered: title -> tags -> url -> desc', () => {
	const awesomeFilter = filterBookmarks(bookmarks, 'awesome');
	const expectedAwesomeResult =
		[superBookmark, coolBookmark, unstoppableBookmark, incredibleBookmark];

	expect(awesomeFilter).not.toBe(bookmarks);
	expect(awesomeFilter).toMatchObject(expectedAwesomeResult);

	const greatFilter = filterBookmarks(bookmarks, 'GREaT');
	const expectedGreatResult = [incredibleBookmark];

	expect(greatFilter).not.toBe(bookmarks);
	expect(greatFilter).toMatchObject(expectedGreatResult);
});
