import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { Message } from '../../core/model/core.interface';
import { AppState, CurrentSelection } from '../../core/store/app.state';
import { selectCurrentSelection } from '../../core/store/selectors/current-selection.selectors';
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

        this.sendMessageVm$.pipe(tap(({ error, postResponse, sendMessage }) => {
            //
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
