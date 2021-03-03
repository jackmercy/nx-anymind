import { createSelector } from '@ngrx/store';
import { AppState, CurrentSelection } from '../app.state';


export const selectCurrentSelectionFeature = (state: AppState) => state.currentSelection;

export const selectCurrentSelection = createSelector(
    selectCurrentSelectionFeature,
    (state: CurrentSelection) => state
);

// select current user
export const selectCurrentUserId = createSelector(
    selectCurrentSelectionFeature,
    (state: CurrentSelection) => state.currentUserId
);


// select current channel
export const selectCurrentChannelId = createSelector(
    selectCurrentSelectionFeature,
    (state: CurrentSelection) => state.currentChannelId
);

