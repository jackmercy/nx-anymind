import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChannelEntityState } from '../app.state';
import { channelAdapter } from '../reducers/channels.reducer';

// Select all channels
export const selectChannelState = createFeatureSelector<ChannelEntityState>('channels');
const { selectAll } = channelAdapter.getSelectors();

export const selectChannels = createSelector(selectChannelState, selectAll);
