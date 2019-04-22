import { initBadgeAndListen } from 'Modules/badge';
import { initContextMenusAndListen, sendTabsToStagingArea } from 'Modules/context';
import { listenForIsomorphicMessages, IsomorphicMessage } from 'Comms/isomorphic';

initBadgeAndListen().then((syncBadge) => {
	listenForIsomorphicMessages((msg) => {
		switch (msg) {
			case IsomorphicMessage.BookmarksUpdatedInLocalStorage:
				syncBadge();
				break;
		}
	});
});

initContextMenusAndListen(sendTabsToStagingArea);
