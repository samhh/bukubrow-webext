import React, { FC } from "react"
import { useSelector, useDispatch } from "~/store"
import { getBookmarkToEdit } from "~/store/selectors"
import { updateBookmark } from "~/store/bookmarks/epics"
import { LocalBookmark } from "~/modules/bookmarks"
import BookmarkForm from "~/components/bookmark-form"

const BookmarkEditForm: FC = () => {
  const bookmarkToEdit = useSelector(getBookmarkToEdit)
  const dispatch = useDispatch()

  return (
    <BookmarkForm
      bookmark={bookmarkToEdit}
      // TODO assertion
      onSubmit={(bm: LocalBookmark): void => void dispatch(updateBookmark(bm))}
    />
  )
}

export default BookmarkEditForm
