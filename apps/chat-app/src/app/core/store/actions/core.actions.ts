import { createAction, props } from '@ngrx/store';
import { channelId, userId } from '../../type/core.interface';

// User
export const getUsers = createAction(
    'Get List Users',
);

export const getCurrentUser = createAction(
    'Get Current User',
);

export const setCurrentUser = createAction(
    'Set current user',
    props<{ userId: userId }>()
);

// Channel
export const getChannels = createAction(
    'Get List Channels',
);

export const getCurrentChannel = createAction(
    'Get current Channel',
);

export const setCurrentChannel = createAction(
    'Set current channel',
    props<{ channelId: channelId }>()
);
