/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { constant } from "fp-ts/lib/function"
import * as O from "fp-ts/lib/Option"
import * as EO from "~/modules/eitherOption"
import { onTabActivity } from "~/modules/comms/browser"
import {
  checkBinaryVersionFromNative,
  HostVersionCheckResult,
} from "~/modules/comms/native"
import { getActiveTheme, getNormalizeTags, Theme } from "~/modules/settings"
import { ThunkAC, initAutoStoreSync } from "~/store"
import {
  setLimitNumRendered,
  setFocusedBookmarkIndex,
} from "~/store/bookmarks/actions"
import {
  setActiveTheme,
  setNormalizeTags,
  hostCheckResult,
  setPage,
} from "~/store/user/actions"
import { setSearchFilter } from "~/store/input/actions"
import { addPermanentError } from "~/store/notices/epics"
import {
  syncStagedBookmarksGroups,
  syncBookmarks,
} from "~/store/bookmarks/epics"
import { syncBrowserInfo } from "~/store/browser/epics"
import { getWeightedLimitedFilteredBookmarks } from "~/store/selectors"
import {
  listenForIsomorphicMessages,
  IsomorphicMessage,
} from "~/modules/comms/isomorphic"
import { Page } from "~/store/user/types"
import { runIO } from "~/modules/fp"

const hostCheckErrMsg = (x: HostVersionCheckResult): Option<string> => {
  switch (x) {
    case HostVersionCheckResult.HostTooNew:
      return O.some("The WebExtension is outdated relative to the host")
    case HostVersionCheckResult.HostOutdated:
      return O.some("The host is outdated")
    case HostVersionCheckResult.NoComms:
      return O.some("The host could not be found")
    case HostVersionCheckResult.UnknownError:
      return O.some("An unknown error occurred")
    default:
      return O.none
  }
}

const onLoadPostComms = (): ThunkAC => dispatch => {
  // Store sync initialised here to prevent race condition with staged groups
  initAutoStoreSync()
  dispatch(syncBookmarks())
  dispatch(syncStagedBookmarksGroups())

  // Sync browser info once now on load and then again whenever there's any tab
  // activity
  dispatch(syncBrowserInfo())
  onTabActivity(() => {
    dispatch(syncBrowserInfo())
  })
}

export const onLoad = (): ThunkAC<Promise<void>> => async dispatch => {
  runIO(
    listenForIsomorphicMessages(x => {
      switch (x) {
        case IsomorphicMessage.OpenAddBookmarkCommand:
          dispatch(setPage(Page.AddBookmark))
          return
      }
    }),
  )

  getActiveTheme()
    .then(EO.getOrElse(constant<Theme>(Theme.Light)))
    .then(theme => {
      dispatch(setActiveTheme(theme))
    })

  getNormalizeTags()
    .then(EO.getOrElse(constant<boolean>(false)))
    .then(normTags => {
      dispatch(setNormalizeTags(normTags))
    })

  const res = await checkBinaryVersionFromNative()
  dispatch(hostCheckResult(res))

  if (res === HostVersionCheckResult.Okay) dispatch(onLoadPostComms())

  const err = hostCheckErrMsg(res)
  if (O.isSome(err)) dispatch(addPermanentError(err.value))
}

export const setSearchFilterWithResets = (filter: string): ThunkAC => (
  dispatch,
  getState,
) => {
  dispatch(setSearchFilter(filter))
  dispatch(setLimitNumRendered(true))

  const filteredBookmarks = getWeightedLimitedFilteredBookmarks(getState())

  dispatch(
    setFocusedBookmarkIndex(filteredBookmarks.length ? O.some(0) : O.none),
  )
}
