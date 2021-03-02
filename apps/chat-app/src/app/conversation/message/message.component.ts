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
    @Input() messageStatus: 'loading' | 'unsent' = undefined;

    getMessageContainerClassName(): string {
        if (this.isUserMessage) {
            return 'flex items-center justify-start flex-row-reverse';
        }
        return 'flex flex-row items-center';
    }
}
