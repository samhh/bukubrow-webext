import { pipe } from "fp-ts/lib/pipeable"
import { flow, constVoid, constant } from "fp-ts/lib/function"
import * as T from "fp-ts/lib/Task"
import * as TO from "fp-ts-contrib/lib/TaskOption"
import * as O from "fp-ts/lib/Option"
import * as A from "fp-ts/Array"
import { initBadgeAndListen } from "~/modules/badge"
import {
  initContextMenusAndListen,
  sendTabsToStagingArea,
} from "~/modules/context"
import {
  listenForIsomorphicMessages,
  IsomorphicMessage,
  sendIsomorphicMessage,
} from "~/modules/comms/isomorphic"
import {
  executeCodeInActiveTab,
  getBookmarksFromLocalStorageInfallible,
  openPopup,
} from "~/modules/comms/browser"
import { listenForCommands, Command } from "~/modules/command"
import { runIO, runTask, runTask_ } from "~/modules/fp"
import sleep from "~/modules/sleep"
import { contextClickTabs, ContextMenuEntry } from "~/modules/context"
import { browser, Omnibox } from "webextension-polyfill-ts"
import { onOmniboxInput, onOmniboxSubmit } from "~/modules/omnibox"
import { includesCI } from "~modules/string"
import { mkBookmarkletCode } from "~modules/bookmarklet"

export const omniboxSubmitHandler = (url: string) => (
  d: Omnibox.OnInputEnteredDisposition,
): IO<void> => () =>
  pipe(
    url,
    mkBookmarkletCode,
    O.fold(() => {
      switch (d) {
        case "currentTab":
          return void browser.tabs.update({ url })
        case "newForegroundTab":
        case "newBackgroundTab":
          return void browser.tabs.create({ url })
      }
    }, flow(executeCodeInActiveTab, runTask_)),
  )

runIO(
  onOmniboxInput(input =>
    pipe(
      getBookmarksFromLocalStorageInfallible,
      T.map(
        A.filterMap(bm =>
          includesCI(input)(bm.title)
            ? O.some({ content: bm.url, description: bm.title })
            : O.none,
        ),
      ),
    ),
  ),
)

runIO(onOmniboxSubmit(omniboxSubmitHandler))

initBadgeAndListen().then(f => {
  runIO(
    listenForIsomorphicMessages(x => {
      switch (x) {
        case IsomorphicMessage.SettingsUpdated:
        case IsomorphicMessage.BookmarksUpdatedInLocalStorage:
          runTask(f)
          break
      }
    }),
  )
})

runIO(initContextMenusAndListen(sendTabsToStagingArea))

const cmdCtx = {
  [Command.StageAllTabs]: ContextMenuEntry.SendAllTabs,
  [Command.StageWindowTabs]: ContextMenuEntry.SendActiveWindowTabs,
  [Command.StageActiveTab]: ContextMenuEntry.SendActiveTab,
}

const getTabs = contextClickTabs(O.none)

runIO(
  listenForCommands(x => {
    switch (x) {
      case Command.AddBookmark:
        runIO(openPopup)
        runTask(
          pipe(
            // Wait 100ms so that the popup can load and start listening for
            // messages
            sleep(100),
            T.chain(
              flow(
                constant(
                  sendIsomorphicMessage(
                    IsomorphicMessage.OpenAddBookmarkCommand,
                  ),
                ),
                T.map(constVoid),
              ),
            ),
          ),
        )
        return

      case Command.StageAllTabs:
      case Command.StageWindowTabs:
      case Command.StageActiveTab:
        runTask(
          pipe(
            getTabs(cmdCtx[x]),
            TO.chain(flow(sendTabsToStagingArea, TO.fromTaskEither)),
          ),
        )
        return
    }
  }),
)
