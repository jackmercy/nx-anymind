import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../app.state';
import { channelReducer } from './channels.reducer';
import { currentSelectionReducer } from './current-selection.reducer';
import { userReducer } from './users.reducer';

export const reducers: ActionReducerMap<AppState> = {
    channels: channelReducer,
    currentSelection: currentSelectionReducer,
    users: userReducer
};


