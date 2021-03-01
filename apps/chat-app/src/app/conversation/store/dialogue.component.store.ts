import { query } from '@angular/animations';
import { variable } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { ImmerComponentStore } from 'ngrx-immer/component-store';
import { switchMap, tap } from 'rxjs/operators';
import { Channel, Message, User } from '../../core/model/core.interface';
import { channelId, qlStatus, userId } from '../../core/type/core.type';
import { SendMessageComponentStore } from './send-message.store';


export interface DialogueComponentState {
    fetchLatestStatus: qlStatus;
    fetchOlderMessageStatus: qlStatus;
    fetchNewerMessageStatus: qlStatus;
    dialogues: Message[];
}

const QueryLatestQL = gql`
query fetchLatest($channelId: String!){
	fetchLatestMessages(channelId: $channelId) {
    messageId,
		text,
		datetime,
		userId,
  }
}
`;

const QueryMoreQL = gql`
query fetchMore($channelId: String!, $messageId: String!, $old: Boolean!){
	fetchMoreMessages(channelId: $channelId, messageId:$messageId, old:$old) {
    messageId,
		text,
		datetime,
		userId,
  }
}
`;

@Injectable()
export class DialogueComponentStore extends ImmerComponentStore<DialogueComponentState> {
    readonly viewModel$ = this.select(this.state$, ({ dialogues: dialogue }) => ({
        dialogue
    }));

    readonly updateFetchLatestStatus = this.updater<qlStatus>((state, status) => {
        state.fetchLatestStatus = status;
    });

    readonly updateFetchOlderStatus = this.updater<qlStatus>((state, status) => {
        state.fetchOlderMessageStatus = status;
    });

    readonly updateFetchNewerStatus = this.updater<qlStatus>((state, status) => {
        state.fetchNewerMessageStatus = status;
    });

    readonly updateDialogues = this.updater<Message[]>((state, messages) => {
        state.dialogues = messages;
    });

    readonly fetchLatestMessageEffect = this.effect<channelId>(event$ => event$.pipe(
        tap(() => this.updateFetchLatestStatus('loading')),
        switchMap(channelId => this.apollo.watchQuery({
            query: QueryLatestQL,
            variables: {
                channelId: channelId
            }
        }).valueChanges.pipe(
            tap(({ data, error, loading }) => {
                if (!error && !loading) {
                    this.updateFetchLatestStatus('success');
                    const result: any = data;
                    this.updateDialogues(result?.fetchMoreMessages);
                }
            })
        ))
    ));

    constructor(
        private apollo: Apollo,
        private sendMessageComponentStore: SendMessageComponentStore
    ) {
        super({
            dialogues: undefined,
            fetchLatestStatus: undefined,
            fetchNewerMessageStatus: undefined,
            fetchOlderMessageStatus: undefined
        } as DialogueComponentState);
    }
}
