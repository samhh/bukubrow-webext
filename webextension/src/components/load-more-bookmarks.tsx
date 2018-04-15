import React, { SFC } from 'react';

interface Props {
	numRemainingBookmarks: number;
	renderAllBookmarks(renderAll: boolean): void;
}

const LoadMoreBookmarks: SFC<Props> = ({ numRemainingBookmarks, renderAllBookmarks }) => (
	<p
		className="bookmarks__more-note"
		onClick={() => { renderAllBookmarks(true); }} // tslint:disable-line jsx-no-lambda
	>
		...and {numRemainingBookmarks} more.
	</p>
);

export default LoadMoreBookmarks;
