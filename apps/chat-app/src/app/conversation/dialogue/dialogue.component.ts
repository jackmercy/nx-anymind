import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Message, User } from '../../core/model/core.interface';
import { AppState, CurrentSelection } from '../../core/store/app.state';
import { selectCurrentSelection } from '../../core/store/selectors/current-selection.selectors';
import { selectUsers } from '../../core/store/selectors/user.selectors';
import { DialogueComponentStore } from '../store/dialogue.component.store';

@Component({
    selector: 'nx-anymind-dialogue',
    templateUrl: './dialogue.component.html',
    styleUrls: ['./dialogue.component.scss']
})
export class DialogueComponent implements OnInit, AfterViewInit {
    @ViewChild('scrollMe') private gridChat: ElementRef;
    currentSelection: CurrentSelection;
    users: User[];
    viewModel$ = this.componentStore.viewModel$;
    dialogue: Message[] = [];

    constructor(
        private componentStore: DialogueComponentStore,
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

        this.viewModel$.subscribe(
            vm => {
                this.dialogue = vm.dialogues;
                if (vm.sendStatus === 'loading') {
                    this.scrollToBottom();
                }
            }
        );

        this.store.pipe(select(selectUsers)).subscribe(users => this.users = users);

        this.scrollToBottom();
    }

    ngAfterViewInit() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.gridChat.nativeElement.scrollTop = this.gridChat.nativeElement.scrollHeight;
        } catch(err) { }                 
    }

    getMoreMessage(old: boolean): void {
        let messageId;
        if (old === true) {
            messageId = this.dialogue[this.dialogue.length - 1]?.messageId;
        } else if (old === false) {
            messageId = this.dialogue[0]?.messageId;
            this.scrollToBottom();
        }

        this.componentStore.fetchMoreMessageEffect({
            messageId: messageId,
            channelId: this.currentSelection?.currentChannelId,
            old: old
        });
    }

    getUserAvatar(userId: string): string {
        return this.users.find(user => user.id === userId)?.avatar;
    }

    isUserMessage(messageId: string): boolean {
        return messageId === this.currentSelection.currentUserId;
    }

    getMessageGridClassName(isUserMessage: boolean): string {
        if (isUserMessage) {
            return 'col-start-6 col-end-13 p-3 rounded-lg';
        }
        return 'col-start-1 col-end-8 p-3 rounded-lg';
    }
}
