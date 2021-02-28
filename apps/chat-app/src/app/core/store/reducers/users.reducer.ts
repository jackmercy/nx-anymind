import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { User } from '../../model/core.interface';
import { UserEntityState } from '../app.state';
import * as actions from '../actions/core.actions';
import { usersData } from '../../data/user.data';

export const userAdapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialState: UserEntityState = userAdapter.getInitialState();

const reducer = createReducer(
    initialState,
    on(actions.initUsers, (state) => {
        return userAdapter.setAll(usersData, state);
    }),
    on(actions.setCurrentUser, (state, { update }) => {
        return userAdapter.updateOne(update, state);
    })
);

export function userReducer(state: UserEntityState | undefined, action: Action) {
    return reducer(state, action);
}

