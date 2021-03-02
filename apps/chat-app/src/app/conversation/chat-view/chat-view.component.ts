import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Channel } from '../../core/model/core.interface';
import { AppState, CurrentSelection } from '../../core/store/app.state';
import { selectChannels } from '../../core/store/selectors/channels.selectors';
import { selectCurrentSelection } from '../../core/store/selectors/current-selection.selectors';
import { channelId } from '../../core/type/core.type';
import { SendMessageComponentStore } from '../store/send-message.store';

// I put provider of Send message component store here b/c 
// I want child component could inject this service not just the SendMessageComponent only.

@Component({
    selector: 'nx-anymind-chat-view',
    templateUrl: './chat-view.component.html',
    styleUrls: ['./chat-view.component.scss'],
    providers: [SendMessageComponentStore]
})
export class ChatViewComponent implements OnInit {
    currentSelection$: Observable<CurrentSelection>;
    channels$: Observable<Channel[]>;

    constructor(private store: Store<AppState>) { }

    ngOnInit() {
        this.currentSelection$ = this.store.pipe(select(selectCurrentSelection));
        this.channels$ = this.store.pipe(select(selectChannels));
    }

    getChannelName(channels: Channel[], currentChannelId: channelId): string {
        const currentChannel = channels.find(channel => channel.id === currentChannelId);
        return currentChannel?.name || 'Channel name';
    }
}
