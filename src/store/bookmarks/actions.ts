/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { action } from "typesafe-actions"
import { LocalBookmark } from "~/modules/bookmarks"
import { StagedBookmarksGroup } from "~/modules/staged-groups"
import { BookmarksActionTypes } from "./types"

export const setAllBookmarks = (bookmarks: Array<LocalBookmark>) =>
  action(BookmarksActionTypes.SetAllBookmarks, bookmarks)

export const setAllStagedBookmarksGroups = (
  groups: Array<StagedBookmarksGroup>,
) => action(BookmarksActionTypes.SetAllStagedBookmarksGroups, groups)

export const deleteStagedBookmarksGroup = (
  groupId: StagedBookmarksGroup["id"],
) => action(BookmarksActionTypes.DeleteStagedBookmarksGroup, groupId)

export const setLimitNumRendered = (limit: boolean) =>
  action(BookmarksActionTypes.SetLimitNumRendered, limit)

export const setFocusedBookmarkIndex = (index: Option<number>) =>
  action(BookmarksActionTypes.SetFocusedBookmarkIndex, index)

export const setBookmarkEditId = (id: Option<LocalBookmark["id"]>) =>
  action(BookmarksActionTypes.SetBookmarkEditId, id)

export const setBookmarkDeleteId = (id: Option<LocalBookmark["id"]>) =>
  action(BookmarksActionTypes.SetBookmarkDeleteId, id)

export const setStagedBookmarksGroupEditId = (
  id: Option<StagedBookmarksGroup["id"]>,
) => action(BookmarksActionTypes.SetStagedBookmarksGroupEditId, id)

export const setStagedBookmarksGroupBookmarkEditId = (
  id: Option<LocalBookmark["id"]>,
) => action(BookmarksActionTypes.SetStagedBookmarksGroupBookmarkEditId, id)

export const updateStagedBookmarksGroupBookmark = (
  grpId: StagedBookmarksGroup["id"],
  bm: LocalBookmark,
) =>
  action(BookmarksActionTypes.UpdateStagedBookmarksGroupBookmark, [
    grpId,
    bm,
  ] as const)

export const deleteStagedBookmarksGroupBookmark = (
  grpId: StagedBookmarksGroup["id"],
  bmId: LocalBookmark["id"],
) =>
  action(BookmarksActionTypes.DeleteStagedBookmarksGroupBookmark, [
    grpId,
    bmId,
  ] as const)

export const setDeleteBookmarkModalDisplay = (display: boolean) =>
  action(BookmarksActionTypes.SetDeleteBookmarkModalDisplay, display)
