import { initBadgeAndWatch } from 'Modules/badge';
import { listenForIsomorphicMessages, IsomorphicMessage } from 'Comms/isomorphic';

initBadgeAndWatch().then((syncBadge) => {
	listenForIsomorphicMessages((msg) => {
		switch (msg) {
			case IsomorphicMessage.BookmarksUpdatedInLocalStorage:
				syncBadge();
				break;
		}
	});
});

