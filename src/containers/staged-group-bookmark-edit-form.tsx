import React, { FC } from "react"
import * as O from "fp-ts/lib/Option"
import { useDispatch, useSelector } from "~/store"
import { getStagedGroupBookmarkToEdit } from "~/store/selectors"
import { updateStagedBookmarksGroupBookmark } from "~/store/bookmarks/actions"
import { setPage } from "~/store/user/actions"
import { Page } from "~/store/user/types"
import { LocalBookmark } from "~/modules/bookmarks"
import BookmarkForm from "~/components/bookmark-form"

const StagedGroupBookmarkEditForm: FC = () => {
  const bookmark = useSelector(getStagedGroupBookmarkToEdit)
  const groupEditId = useSelector(
    state => state.bookmarks.stagedBookmarksGroupEditId,
  )
  const dispatch = useDispatch()

  const handleSubmit = (bm: LocalBookmark): void => {
    if (O.isSome(groupEditId)) {
      dispatch(updateStagedBookmarksGroupBookmark(groupEditId.value, bm))
      dispatch(setPage(Page.StagedGroup))
    }
  }

  if (O.isNone(bookmark)) return null

  return <BookmarkForm bookmark={bookmark} onSubmit={handleSubmit} />
}

export default StagedGroupBookmarkEditForm
