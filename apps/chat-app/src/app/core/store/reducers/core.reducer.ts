import { Action, createReducer, on } from '@ngrx/store';
import { GlobalAppState } from '../app.state';
import * as actions from '../actions/core.actions';

export const initialState: GlobalAppState = {
    currentChannelId: undefined,
    currentUserId: undefined,
    users: [
        {
            id: 'Joyse',
            active: false,
            avatar: 'https://angular-test-backend-yc4c5cvnnq-an.a.run.app/Joyse.png'
        },
        {
            id: 'Russell',
            active: false,
            avatar: 'https://angular-test-backend-yc4c5cvnnq-an.a.run.app/Russell.png'
        },
        {
            id: 'Sam',
            active: false,
            avatar: 'https://angular-test-backend-yc4c5cvnnq-an.a.run.app/Sam.png'
        },
    ],
    channels: [
        {
            id: '1',
            name: 'General Channel',
            active: false
        },
        {
            id: '2',
            name: 'Technology Channel',
            active: false
        },
        {
            id: '2',
            name: 'LGTM Channel',
            active: false
        },
    ],
};

const reducer = createReducer(
    initialState,
    on(actions.setCurrentUser, (state, { userId }) => {
        const usersClone = [...state.users];
        usersClone.forEach(user => {
            if (user.id === userId) {
                user.active = true
            }
            user.active = false;
        });

        return {
            ...state,
            currentUserId: userId,
            users: usersClone
        };
    })
);

export function c(state: ProfileState | undefined, action: Action) {
    return reducer(state, action);
}

