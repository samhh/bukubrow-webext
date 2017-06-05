import { h } from 'preact'

const loadMoreBookmarks = ({ numRemainingBookmarks, renderAllBookmarks }) => (
	<p
		className="bookmarks__more-note"
		onClick={() => renderAllBookmarks(true)}
	>
		...and {numRemainingBookmarks} more.
	</p>
)

export default loadMoreBookmarks
