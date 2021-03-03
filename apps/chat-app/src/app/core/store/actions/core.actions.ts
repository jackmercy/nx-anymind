import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Channel, User } from '../../model/core.interface';
import { channelId, userId } from '../../type/core.type';

// User
// export const getUsers = createAction(
//     'Get List Users',
// );

// export const getCurrentUser = createAction(
//     'Get Current User',
// );

export const setCurrentUser = createAction(
    'Set current user',
    props<{ userId: userId, update: Update<User> }>()
);

export const initUsers = createAction(
    'init Users'
);

// Channel
// export const getChannels = createAction(
//     'Get List Channels',
// );

// export const getCurrentChannel = createAction(
//     'Get current Channel',
// );

export const setCurrentChannel = createAction(
    'Set current channel',
    props<{ channelId: channelId, update: Update<Channel>[] }>()
);

export const initChannels = createAction(
    'init channels'
);
