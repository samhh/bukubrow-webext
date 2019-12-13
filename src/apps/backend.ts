import { initBadgeAndListen } from 'Modules/badge';
import { initContextMenusAndListen, sendTabsToStagingArea } from 'Modules/context';
import { listenForIsomorphicMessages, IsomorphicMessage } from 'Modules/comms/isomorphic';
import { runIO } from 'Modules/fp';

initBadgeAndListen().then((f) => {
	runIO(listenForIsomorphicMessages((x) => {
		switch (x) {
			case IsomorphicMessage.SettingsUpdated:
			case IsomorphicMessage.BookmarksUpdatedInLocalStorage:
				f();
				break;
		}
	}));
});

runIO(initContextMenusAndListen(sendTabsToStagingArea));

