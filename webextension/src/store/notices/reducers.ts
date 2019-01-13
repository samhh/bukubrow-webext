import { Reducer } from 'redux';
import { ActionType } from 'typesafe-actions';
import * as noticesActions from './actions';
import { NoticesState, NoticesActionTypes } from './types';

export type NoticesActions = ActionType<typeof noticesActions>;

const initialState = {
	errors: {},
};

const noticesReducer: Reducer<NoticesState, NoticesActions> = (state = initialState, action) => {
	switch (action.type) {
		case NoticesActionTypes.AddError:
			return {
				...state,
				errors: {
					...state.errors,
					[action.payload.key]: action.payload.value,
				},
			};
		case NoticesActionTypes.DeleteError: {
			if (!state.errors[action.payload]) return state;

			const errors = { ...state.errors };
			delete errors[action.payload];

			return {
				...state,
				errors,
			};
		}
		default:
			return state;
	}
};

export default noticesReducer;
