import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { ImmerComponentStore } from 'ngrx-immer/component-store';
import { switchMap, tap } from 'rxjs/operators';
import { Message } from '../../core/model/core.interface';
import { channelId, qlStatus } from '../../core/type/core.type';

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


export type QueryMoreRequest = { channelId: channelId, messageId: string, old: boolean }

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
    readonly viewModel$ = this.select(this.state$, ({
        dialogues, fetchLatestStatus, fetchNewerMessageStatus, fetchOlderMessageStatus 
    }) => ({
        dialogues,
        // latest
        isLoadingLatest: fetchLatestStatus === 'loading',
        isFailFetchLatest: fetchLatestStatus === 'fail',
        isSuccessFetchLatest: fetchLatestStatus === 'success',
        // newer
        isLoadingNewer: fetchNewerMessageStatus === 'loading',
        isFailFetchNewer: fetchNewerMessageStatus === 'fail',
        isSuccessFetchNewer: fetchNewerMessageStatus === 'success',
        // older
        isLoadingOlder: fetchOlderMessageStatus === 'loading',
        isFailFetchOlder: fetchOlderMessageStatus === 'fail',
        isSuccessFetchOlder: fetchOlderMessageStatus === 'success'
    }));

    readonly updateFetchLatestStatus = this.updater<qlStatus>((state, status) => {
        state.fetchLatestStatus = status;
    });

    readonly updateFetchMoreStatus = this.updater<{ status: qlStatus, old: boolean }>((state, data) => {
        if (data.old === true) {
            state.fetchOlderMessageStatus = data.status;
        } else if (data.old === false) {
            state.fetchNewerMessageStatus = data.status;
        }
    });

    readonly updateDialogues = this.updater<Message[]>((state, messages) => {
        state.dialogues = messages;
    });

    readonly updateFetchMoreDialogues = this.updater<{ moreDialogue: Message[], old: boolean }>((state, data) => {
        const updatedDialogues = data.old ? [...state.dialogues, ...data.moreDialogue]: [...data.moreDialogue, ...state.dialogues];
        state.dialogues = updatedDialogues;
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
                    this.updateDialogues(result?.fetchLatestMessages);
                }
            })
        ))
    ));

    readonly fetchMoreMessageEffect = this.effect<QueryMoreRequest>(event$ => event$.pipe(
        tap((request) => this.updateFetchMoreStatus({ old: request.old, status: 'loading' })),
        switchMap(( request: QueryMoreRequest ) => {
            const requestData = request;
            return this.apollo.watchQuery({
                query: QueryMoreQL,
                variables: {
                    channelId: request.channelId,
                    messageId: request.messageId,
                    old: request.old
                }
            }).valueChanges.pipe(
                tap(({ data, error, loading }) => {
                    if (!error && !loading) {
                        this.updateFetchMoreStatus({ old: requestData.old, status: 'success' });
                        const result: any = data;
                        this.updateFetchMoreDialogues({ old: requestData.old, moreDialogue: result.fetchMoreMessages as Message[] });
                    }
                })
            )
        })
    ));

    constructor(
        private apollo: Apollo
    ) {
        super({
            dialogues: undefined,
            fetchLatestStatus: undefined,
            fetchNewerMessageStatus: undefined,
            fetchOlderMessageStatus: undefined
        } as DialogueComponentState);
    }
}
