import { pipe } from 'fp-ts/lib/pipeable';
import { flow, constVoid, constant } from 'fp-ts/lib/function';
import * as T from 'fp-ts/lib/Task';
import * as TO from 'fp-ts-contrib/lib/TaskOption';
import * as O from 'fp-ts/lib/Option';
import { initBadgeAndListen } from '~/modules/badge';
import { initContextMenusAndListen, sendTabsToStagingArea } from '~/modules/context';
import { listenForIsomorphicMessages, IsomorphicMessage, sendIsomorphicMessage } from '~/modules/comms/isomorphic';
import { openPopup } from '~/modules/comms/browser';
import { listenForCommands, Command } from '~/modules/command';
import { runIO, runTask } from '~/modules/fp';
import sleep from '~/modules/sleep';
import { contextClickTabs, ContextMenuEntry } from '~/modules/context';

initBadgeAndListen().then((f) => {
	runIO(listenForIsomorphicMessages((x) => {
		switch (x) {
			case IsomorphicMessage.SettingsUpdated:
			case IsomorphicMessage.BookmarksUpdatedInLocalStorage:
				runTask(f);
				break;
		}
	}));
});

runIO(initContextMenusAndListen(sendTabsToStagingArea));

const cmdCtx = {
	[Command.StageAllTabs]: ContextMenuEntry.SendAllTabs,
	[Command.StageWindowTabs]: ContextMenuEntry.SendActiveWindowTabs,
	[Command.StageActiveTab]: ContextMenuEntry.SendActiveTab,
};

const getTabs = contextClickTabs(O.none);

runIO(listenForCommands((x) => {
	switch (x) {
		case Command.AddBookmark:
			runIO(openPopup);
			runTask(pipe(
				// Wait 100ms so that the popup can load and start listening for
				// messages
				sleep(100),
				T.chain(flow(
					constant(sendIsomorphicMessage(IsomorphicMessage.OpenAddBookmarkCommand)),
					T.map(constVoid),
				)),
			));
			return;

		case Command.StageAllTabs:
		case Command.StageWindowTabs:
		case Command.StageActiveTab:
			runTask(pipe(
				getTabs(cmdCtx[x]),
				TO.chain(flow(sendTabsToStagingArea, TO.fromTaskEither)),
			));
			return;
	}
}));

