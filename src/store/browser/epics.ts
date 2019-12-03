import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';
import * as T from 'fp-ts/lib/Task';
import * as O from 'fp-ts/lib/Option';
import * as OT from 'Types/optionTuple';
import * as Rx from 'rxjs/operators';
import { ofType, fromTask, filterSome } from 'Modules/rx';
import { combineEpics } from 'redux-observable';
import { Epic } from 'Store';
import { getActiveTab } from 'Comms/browser';
import { BrowserActionTypes } from './types';
import { setPageMeta } from './actions';

type PageMetaAction = ReturnType<typeof setPageMeta.success>;

const setPageMetaFromActiveTab: T.Task<O.Option<PageMetaAction>> = pipe(
	getActiveTab,
	T.map(flow(
		O.chain(tab => OT.fromNullable(tab.title, tab.url)),
		O.map(([pageTitle, pageUrl]) => setPageMeta.success({ pageTitle, pageUrl })),
	)),
);

const syncBrowserInfoEpic: Epic = (a$) => a$.pipe(
	ofType(BrowserActionTypes.SyncBrowserRequest),
	Rx.switchMap(() => fromTask(setPageMetaFromActiveTab).pipe(filterSome)),
);

const browserEpic = combineEpics(syncBrowserInfoEpic);

export default browserEpic;

