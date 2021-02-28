import { channelId, userId } from '../type/core.type';
import { User, Channel } from '../model/core.interface';
import { EntityState } from '@ngrx/entity';

export interface UserEntityState extends EntityState<User> { }
export interface ChannelEntityState extends EntityState<Channel> { }

export interface CurrentSelection {
    currentChannelId: channelId;
    currentUserId: userId;
}

export interface AppState {
    currentSelection: CurrentSelection;
    users: UserEntityState;
    channels: ChannelEntityState;
}
