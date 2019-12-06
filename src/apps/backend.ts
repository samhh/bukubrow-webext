import { initBadgeAndListen } from 'Modules/badge';
import { initContextMenusAndListen, sendTabsToStagingArea } from 'Modules/context';
import { listenForIsomorphicMessages, IsomorphicMessage } from 'Modules/comms/isomorphic';

initBadgeAndListen().then((syncBadge) => {
	listenForIsomorphicMessages((msg) => {
		switch (msg) {
			case IsomorphicMessage.SettingsUpdated:
			case IsomorphicMessage.BookmarksUpdatedInLocalStorage:
				syncBadge();
				break;
		}
	})();
});

initContextMenusAndListen(sendTabsToStagingArea)();

