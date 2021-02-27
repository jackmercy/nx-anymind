import { GenericItem } from '../type/core.interface';

export interface GlobalAppState {
    currentChannelId: string;
    currentUserId: string;
    users: GenericItem[];
    channels: GenericItem[]; 
}
