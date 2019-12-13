import { ActionType } from 'typesafe-actions';
import { identity } from 'fp-ts/lib/function';
import * as inputActions from './actions';
import { InputState, InputActionTypes, searchFilter } from './types';
import { curryReducer } from 'Modules/redux';

export type InputActions = ActionType<typeof inputActions>;

const initialState: InputState = {
	searchFilter: '',
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const inputReducer = curryReducer<InputActions, InputState>((a) => (_s) => {
	switch (a.type) {
		case InputActionTypes.SetSearchFilter:
			return searchFilter.set(a.payload);

		default:
			return identity;
	}
})(initialState);

export default inputReducer;

