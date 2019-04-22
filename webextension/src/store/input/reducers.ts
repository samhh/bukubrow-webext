import { Reducer } from 'redux';
import { ActionType } from 'typesafe-actions';
import * as inputActions from './actions';
import { InputState, InputActionTypes } from './types';

export type InputActions = ActionType<typeof inputActions>;

const initialState = {
	searchFilter: '',
};

const inputReducer: Reducer<InputState, InputActions> = (state = initialState, action) => {
	switch (action.type) {
		case InputActionTypes.SetSearchFilter:
			return {
				...state,
				searchFilter: action.payload,
			};

		default:
			return state;
	}
};

export default inputReducer;
