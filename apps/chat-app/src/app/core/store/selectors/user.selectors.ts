import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserEntityState } from '../app.state';
import { userAdapter } from '../reducers/users.reducer';

// Select all users
export const selectUserState = createFeatureSelector<UserEntityState>('users');
const { selectAll } = userAdapter.getSelectors();

export const selectUsers = createSelector(selectUserState, selectAll);


