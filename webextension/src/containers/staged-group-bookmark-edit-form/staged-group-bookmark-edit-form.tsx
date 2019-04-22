import React, { FC } from 'react';
import { Maybe } from 'purify-ts/Maybe';
import BookmarkForm from 'Components/bookmark-form';

interface Props {
	onSubmit(bookmark: LocalBookmark): void;
	onExit(): void;
	bookmark: Maybe<LocalBookmark>;
}

const StagedGroupBookmarkEditForm: FC<Props> = props => props.bookmark.caseOf({
	Just: () => (
		<BookmarkForm
			bookmark={props.bookmark} // Form still wants Maybe TODO
			onClose={props.onExit}
			onSubmit={props.onSubmit}
		/>
	),
	Nothing: () => null,
});

export default StagedGroupBookmarkEditForm;
