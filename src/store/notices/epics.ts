import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';
import * as A from 'fp-ts/lib/Array';
import { timer } from 'rxjs';
import * as Rx from 'rxjs/operators';
import { ofType } from 'Modules/rx';
import { combineEpics } from 'redux-observable';
import { Epic } from 'Store';
import { addError, deleteError } from './actions';
import { NoticesActionTypes, NoticesState, NoticeMsg } from './types';
import { createUuid } from 'Modules/uuid';
import { toString } from 'Modules/string';
import { toNumber } from 'Modules/number';
import { keysOf } from 'Modules/object';

type Errors = NoticesState['errors'];

const getErrorIds = (x: Errors) => pipe(
	x,
	keysOf,
	A.filterMap(toNumber),
);

const createUniqueErrorId = (x: Errors) => pipe(
	x,
	getErrorIds,
	createUuid,
	toString,
);

const createError = (msg: NoticeMsg, timeout: number) => flow(
	createUniqueErrorId,
	id => addError(id, msg, timeout),
);

const addPermanentErrorEpic: Epic = (a$, s$) => a$.pipe(
	ofType(NoticesActionTypes.AddPermanentErrorRequest),
	Rx.map(({ payload: msg }) => createError(msg, Infinity)(s$.value.notices.errors)),
);

const addTransientErrorEpic: Epic = (a$, s$) => a$.pipe(
	ofType(NoticesActionTypes.AddTransientErrorRequest),
	Rx.map(({ payload: msg }) => createError(msg, 5000)(s$.value.notices.errors)),
);

const removeTransientErrorEpic: Epic = a$ => a$.pipe(
	ofType(NoticesActionTypes.AddError),
	Rx.filter(({ payload: { timeout } }) => timeout !== Infinity),
	Rx.mergeMap(({ payload: { key, timeout } }) => timer(timeout).pipe(Rx.mapTo(deleteError(key)))),
);

const noticesEpic = combineEpics(
	addPermanentErrorEpic,
	addTransientErrorEpic,
	removeTransientErrorEpic,
);

export default noticesEpic;

