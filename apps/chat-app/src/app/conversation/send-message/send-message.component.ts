import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AppState, CurrentSelection } from '../../core/store/app.state';
import { selectCurrentSelection } from '../../core/store/selectors/current-selection.selectors';
import { DialogueComponentStore } from '../store/dialogue.component.store';

@Component({
    selector: 'nx-anymind-send-message',
    templateUrl: './send-message.component.html',
    styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {
    sendInput = new FormControl('');
    currentSelection: CurrentSelection;
    viewModel$ = this.componentStore.viewModel$;

    constructor(
        private store: Store<AppState>,
        private componentStore: DialogueComponentStore
    ) {}

    ngOnInit() {
        this.store.pipe(select(selectCurrentSelection)).subscribe(value => {
            this.currentSelection = value;
            const initSendInput = sessionStorage.getItem(this.currentSelection.currentChannelId);
            this.sendInput.setValue(
                initSendInput !== 'null' ? initSendInput : ''
            );
        });

        this.sendInput.valueChanges.subscribe(
            value => {
                sessionStorage.setItem(this.currentSelection.currentChannelId, value);
            }
        );
    }

    sendMessage(): void {
        this.componentStore.sendMessageEffect({
            reqBody: {
                channelId: this.currentSelection.currentChannelId,
                text: this.sendInput.value,
                userId: this.currentSelection.currentUserId
            }
        });

        this.sendInput.setValue('');
    }
}
