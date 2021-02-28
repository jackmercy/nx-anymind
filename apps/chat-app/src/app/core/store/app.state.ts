import { channelId, userId } from '../type/core.type';
import { User, Channel } from '../model/core.interface';

export interface GlobalAppState {
    currentChannelId: channelId;
    currentUserId: userId;
    users: User[];
    channels: Channel[];
}
