import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationRoutingModule } from './conversation.routing';
import { ChatViewComponent } from './chat-view/chat-view.component';
import { DialogueComponent } from './dialogue/dialogue.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { MessageComponent } from './message/message.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        ChatViewComponent, DialogueComponent, SendMessageComponent, MessageComponent
    ],
    imports: [
        CommonModule,
        ConversationRoutingModule,
        ReactiveFormsModule
    ]
})
export class ConversationModule { }
