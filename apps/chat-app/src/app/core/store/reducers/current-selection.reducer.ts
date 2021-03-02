import { Action, createReducer, on } from '@ngrx/store';
import { CurrentSelection } from '../app.state';
import * as actions from '../actions/core.actions';

export const initialState: CurrentSelection = {
    currentChannelId: undefined,
    currentUserId: undefined
};

const reducer = createReducer(
    initialState,
    on(actions.setCurrentUser, (state, { userId }) => ({
        ...state,
        currentUserId: userId
    })),
    on(actions.setCurrentChannel, (state, { channelId }) => ({
        ...state,
        currentChannelId: channelId
    }))
);

export function currentSelectionReducer(state: CurrentSelection | undefined, action: Action) {
    return reducer(state, action);
}

