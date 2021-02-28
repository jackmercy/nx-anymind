import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Channel, User } from '../../core/model/core.interface';
import { AppState } from '../../core/store/app.state';
import { selectChannels } from '../../core/store/selectors/channels.selectors';
import { selectUsers } from '../../core/store/selectors/user.selectors';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'
import { userId } from '../../core/type/core.type';
import { setCurrentChannel } from '../../core/store/actions/core.actions';
@Component({
    selector: 'nx-anymind-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
    users$: Observable<User[]>;
    channels$: Observable<Channel[]>;
    selectedUserId: userId;
    currentUser: User;
    private channels: Channel[];

    constructor(private store: Store<AppState>) { }

    ngOnInit() {
        this.users$ = this.store.pipe(select(selectUsers));
        // using this.channels to store data and pipe/tap instead of subscribe b/c I leave the async pipe of angular handle
        // the subscription & unsubscription. 
        this.channels$ = this.store.pipe(select(selectChannels), tap(data => this.channels = data));
    }

    onSelectUser($event: User): void {
        this.currentUser = $event;
    }

    onChangeChannel(selectedChannel: Channel): void {
        const updater = [];
        this.channels.forEach(channel => {
            updater.push({
                changes: {...channel, active: selectedChannel.id === channel.id},
                id: channel.id
            });
        });

        this.store.dispatch(setCurrentChannel({
            channelId: selectedChannel.id, update: updater
        }));
    }
}

