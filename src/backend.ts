import { pipe } from 'fp-ts/lib/pipeable';
import { flow, constVoid, constant } from 'fp-ts/lib/function';
import * as T from 'fp-ts/lib/Task';
import { initBadgeAndListen } from '~/modules/badge';
import { initContextMenusAndListen, sendTabsToStagingArea } from '~/modules/context';
import { listenForIsomorphicMessages, IsomorphicMessage, sendIsomorphicMessage } from '~/modules/comms/isomorphic';
import { openPopup } from '~/modules/comms/browser';
import { listenForCommands, Command } from '~/modules/command';
import { runIO, runTask } from '~/modules/fp';
import sleep from '~/modules/sleep';

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
	}
}));

