import { ActionType } from 'typesafe-actions';
import { identity } from 'fp-ts/lib/function';
import * as R from 'fp-ts/lib/Record';
import * as noticesActions from './actions';
import { NoticesState, NoticesActionTypes, errors } from './types';
import { curryReducer } from 'Modules/redux';

export type NoticesActions = ActionType<typeof noticesActions>;

const initialState: NoticesState = {
	errors: {},
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const noticesReducer = curryReducer<NoticesActions, NoticesState>((a) => (_s) => {
	switch (a.type) {
		case NoticesActionTypes.AddError:
			return errors.modify(R.insertAt<string, string | undefined>(a.payload.key, a.payload.value));

		case NoticesActionTypes.DeleteError:
			return errors.modify(R.deleteAt(a.payload));

		default:
			return identity;
	}
})(initialState);

export default noticesReducer;

