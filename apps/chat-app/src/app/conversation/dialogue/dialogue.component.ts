import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { Message, User } from '../../core/model/core.interface';
import { AppState, CurrentSelection } from '../../core/store/app.state';
import { selectCurrentSelection } from '../../core/store/selectors/current-selection.selectors';
import { selectUsers } from '../../core/store/selectors/user.selectors';
import { DialogueComponentStore } from '../store/dialogue.component.store';
import { SendMessageComponentStore } from '../store/send-message.store';

@Component({
    selector: 'nx-anymind-dialogue',
    templateUrl: './dialogue.component.html',
    styleUrls: ['./dialogue.component.scss'],
    providers: [DialogueComponentStore]
})
export class DialogueComponent implements OnInit {
    currentSelection: CurrentSelection;
    users: User[];
    viewModel$ = this.componentStore.viewModel$;
    sendMessageVm$ = this.sendMessageComponentStore.viewModel$;
    dialogue: Message[] = [];

    constructor(
        private componentStore: DialogueComponentStore,
        private sendMessageComponentStore: SendMessageComponentStore,
        private store: Store<AppState>,
    ) { }

    ngOnInit() {
        this.store.pipe(select(selectCurrentSelection)).subscribe(value => {
            if (value.currentUserId && value.currentChannelId) {
                this.componentStore.fetchLatestMessageEffect(value.currentChannelId);
                this.currentSelection = value;
            } else {
                // snack bar ask to choose user and channel.
            }
        });

        this.viewModel$.pipe(tap(vm => {
            this.dialogue = vm.dialogues;
        }));

        this.store.pipe(select(selectUsers)).subscribe(users => this.users = users);

        this.sendMessageVm$.pipe(tap(({ error, postResponse, sendMessage }) => {
            if (postResponse) {
                this.componentStore.updateNewMessageStatus(postResponse.messageId);
            }
            if (sendMessage) {
                const msg: Message = {
                    dateTime: Date.now().toString(),
                    text: sendMessage.text,
                    userId: this.currentSelection.currentUserId,
                    avatar: this.getUserAvatar(this.currentSelection.currentUserId)
                };
                this.componentStore.addNewMessage(msg);
            }
            if (error) {
                this.componentStore.updateNewMessageStatus('unsent');
            }
        }));
    }

    getMoreMessage(old: boolean): void {
        let messageId;
        if (old === true) {
            messageId = this.dialogue[this.dialogue.length - 1]?.messageId;
        } else if (old === false) {
            messageId = this.dialogue[0]?.messageId
        }

        this.componentStore.fetchMoreMessageEffect({
            messageId: messageId,
            channelId: this.currentSelection?.currentChannelId,
            old: old
        });
    }

    getUserAvatar(userId: string): string {
        return this.users.find(user => user.id === userId)?.id;
    }

    isUserMessage(messageId: string): boolean {
        return messageId === this.currentSelection.currentUserId;
    }

    isUnsentMessage() {
        //
    }

    getMessageGridClassName(isUserMessage: boolean): string {
        if (isUserMessage) {
            return 'col-start-6 col-end-13 p-3 rounded-lg';
        }
        return 'col-start-1 col-end-8 p-3 rounded-lg';
    }
}
