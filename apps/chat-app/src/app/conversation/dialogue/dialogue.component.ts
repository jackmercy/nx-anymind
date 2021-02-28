import { Component } from '@angular/core';
import { Message } from '../../core/model/core.interface';

@Component({
    selector: 'nx-anymind-dialogue',
    templateUrl: './dialogue.component.html',
    styleUrls: ['./dialogue.component.scss']
})
export class DialogueComponent {
    private userMessageGridClass = 'col-start-6 col-end-13 p-3 rounded-lg';
    private incommingMessageGridClass = 'col-start-1 col-end-8 p-3 rounded-lg';
    mockMessage: Message = {
        dateTime: '1614498893737',
        messageId: '1',
        text: 'Hello ku',
        userId: 'Sam',
        avatar: 'https://angular-test-backend-yc4c5cvnnq-an.a.run.app/Sam.png'
    };

    mockReplyMessage: Message = {
        dateTime: '1614498893737',
        messageId: '1',
        text: 'Hi There',
        userId: 'Joyse',
        avatar: 'https://angular-test-backend-yc4c5cvnnq-an.a.run.app/Joyse.png'
    };

    getMessageGridClassName(isUserMessage: boolean): string {
        if (isUserMessage) {
            return this.userMessageGridClass;
        }
        return this.incommingMessageGridClass;
    }
}
