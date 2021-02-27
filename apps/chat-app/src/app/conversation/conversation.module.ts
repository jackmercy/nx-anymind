import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationRoutingModule } from './conversation-routing.module';
import { ChatViewComponent } from './chat-view/chat-view.component';
import { DialogueComponent } from './dialogue/dialogue.component';
import { SendMessageComponent } from './send-message/send-message.component';



@NgModule({
    declarations: [ChatViewComponent, DialogueComponent, SendMessageComponent],
    imports: [
        CommonModule,
        ConversationRoutingModule
    ]
})
export class ConversationModule { }
