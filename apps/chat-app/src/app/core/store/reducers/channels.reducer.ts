import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Channel } from '../../model/core.interface';
import { ChannelEntityState } from '../app.state';
import * as actions from '../actions/core.actions';
import { channelsData } from '../../data/channel.data';

export const channelAdapter: EntityAdapter<Channel> = createEntityAdapter<Channel>();

export const initialState: ChannelEntityState = channelAdapter.getInitialState();

const reducer = createReducer(
    initialState,
    on(actions.initChannels, (state) => {
        return channelAdapter.setAll(channelsData, state);
    }),
    on(actions.setCurrentChannel, (state, { update }) => {
        return channelAdapter.updateMany(update, state);
    })
);

export function channelReducer(state: ChannelEntityState | undefined, action: Action) {
    return reducer(state, action);
}

