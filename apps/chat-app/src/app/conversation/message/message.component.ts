import { Component, Input } from '@angular/core';
import { Message } from '../../core/model/core.interface';

@Component({
    selector: 'nx-anymind-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})
export class MessageComponent {
    @Input() message: Message;
    @Input() isUserMessage = true;
    @Input() messageStatus: string = undefined;
    @Input() avatar: string;

    getMessageContainerClassName(): string {
        if (this.isUserMessage) {
            return 'flex items-center justify-start flex-row-reverse';
        }
        return 'flex flex-row items-center';
    }
}
