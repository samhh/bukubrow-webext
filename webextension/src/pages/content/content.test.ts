import sleep from 'Modules/sleep';

describe('content page', () => {
	test('renders bookmarks dynamically', async () => {
		await page.goto('http://localhost:8080/content/content.build.html');

		const refreshBtnTarget = 'nav button:nth-child(3)';
		const bookmarksListTarget = 'main > ul';
		const bookmarksTarget = `${bookmarksListTarget} > li`;
		const moreTarget = `${bookmarksListTarget} + p`;

		await expect(page).not.toMatchElement(bookmarksListTarget);
		await expect(page).toClick(refreshBtnTarget);
		await expect(page).toMatchElement(bookmarksListTarget);
		await sleep(250);
		const bookmarks = await page.$$(bookmarksTarget);
		await expect(bookmarks.length).toBe(10);
		await expect(page).toClick(moreTarget);
		const allBookmarks = await page.$$(bookmarksTarget);
		await expect(allBookmarks.length).toBeGreaterThan(10);
	});
});
