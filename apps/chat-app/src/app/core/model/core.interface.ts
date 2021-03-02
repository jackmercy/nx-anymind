import { userId, channelId } from '../type/core.type';

export interface User {
    id: userId;
    active?: boolean;
    avatar?: string;
}

export interface Channel {
    id: channelId;
    name: string;
    active?: boolean;
}

export interface Message {
    messageId?: string;
    text: string;
    dateTime: string;
    userId: string;
    avatar?: string;
}
