import { initBadgeAndListen } from '~/modules/badge';
import { initContextMenusAndListen, sendTabsToStagingArea } from '~/modules/context';
import { listenForIsomorphicMessages, IsomorphicMessage } from '~/modules/comms/isomorphic';
import { runIO } from '~/modules/fp';

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

