import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { ImmerComponentStore } from 'ngrx-immer/component-store';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Message } from '../../core/model/core.interface';
import { channelId, qlStatus, userId } from '../../core/type/core.type';

export interface DialogueComponentState {
    fetchLatestStatus: qlStatus;
    fetchOlderMessageStatus: qlStatus;
    fetchNewerMessageStatus: qlStatus;
    dialogues: Message[];

    sendStatus: qlStatus;
    sendMessage: PostMessageRequest;
    postResponse: Message;
    sendError: any;
}

export type PostMessageRequest = {
    channelId: channelId;
    text: string;
    userId: userId;
    avatar?: string;
};

const PostMessageQL = gql`
mutation (
    $channelId: String!,
    $text: String!,
    $userId:String!
) {
    postMessage(channelId:$channelId, text:$text, userId:$userId) {
        messageId,
        text,
        datetime,
        userId
    }
}`;

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
        dialogues, fetchLatestStatus, fetchNewerMessageStatus, fetchOlderMessageStatus, sendStatus
    }) => ({
        sendStatus,
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

    readonly addNewMessage = this.updater<Message>((state, message) => {
        state.dialogues = [{ ...message, messageId: '' }, ...state.dialogues];
    });

    readonly updateNewMessageStatus = this.updater<{ id: string, status: string }>((state, data) => {
        const dialogues = state.dialogues.slice();
        let newMessage = dialogues.shift();
        newMessage = { ...newMessage, messageId: data.id, status: data.status };

        state.dialogues = [{ ...newMessage }, ...dialogues];
    });

    readonly updateErrorMessageStatus = this.updater<{ id: string, status: string }>((state, data) => {
        const dialogues = state.dialogues.slice();
        let errMsg = dialogues.shift();
        const lastSuccessMsg = dialogues.shift();
        // bind ID of last success message to not break the load more message function.
        errMsg = { ...errMsg, messageId: lastSuccessMsg.messageId, status: data.status };

        state.dialogues = [{ ...errMsg }, lastSuccessMsg, ...dialogues];
    });

    readonly updateFetchMoreDialogues = this.updater<{ moreDialogue: Message[], old: boolean }>((state, data) => {
        let updatedDialogues: Message[] = [];
        if (data.old && data.moreDialogue !== null) {
            updatedDialogues = [...state.dialogues, ...data?.moreDialogue];
        } else if (!data.old && data.moreDialogue !== null) {
            updatedDialogues = [...data?.moreDialogue, ...state.dialogues];
        }
        state.dialogues = updatedDialogues;
    });

    readonly updateSendMessageState = this.updater<{
        sendStatus: qlStatus, sendMessage?: PostMessageRequest, postResponse: Message, sendError: any
    }>((state, updater) => {
        state.sendStatus = updater.sendStatus;
        state.sendMessage = updater.sendMessage;
        state.postResponse = updater.postResponse;
        state.sendError = updater.sendError;
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
                    this.updateDialogues(result?.fetchLatestMessages || []);
                }
            })
        ))
    ));

    readonly fetchMoreMessageEffect = this.effect<QueryMoreRequest>(event$ => event$.pipe(
        tap((request) => this.updateFetchMoreStatus({ old: request.old, status: 'loading' })),
        switchMap((request: QueryMoreRequest) => {
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

    readonly sendMessageEffect = this.effect<{ reqBody: PostMessageRequest }>(event$ => event$.pipe(
        tap(({ reqBody }) => {
            // this.updateSendMessage(reqBody);
            // this.updateSendStatus('loading');
            const msg: Message = {
                dateTime: Date.now().toString(),
                text: reqBody.text,
                userId: reqBody.userId,
                avatar: reqBody?.avatar,
                status: 'loading'
            };
            this.updateSendMessageState({
                sendStatus: 'loading',
                sendMessage: reqBody,
                postResponse: undefined,
                sendError: undefined
            });
            this.addNewMessage(msg);
        }),
        switchMap(({ reqBody }) => {
            // cannot identify which message was unsent if user sent multiple messages
            // => limit one message at a time for now b/c the error respone does not 
            // give any information about the message that cause error.
            return this.apollo.mutate({
                mutation: PostMessageQL,
                variables: {
                    ...reqBody
                },
                errorPolicy: 'all',
            }).pipe(
                tap(({ data, errors }) => {
                    const result: any = data;
                    if (!errors && result?.postMessage !== null) {
                        this.updateSendMessageState({
                            sendStatus: 'success',
                            sendMessage: undefined,
                            postResponse: result?.postMessage as Message,
                            sendError: undefined
                        });
                        this.updateNewMessageStatus({
                            status: 'success',
                            id: result?.postMessage.messageId
                        });
                    } else if (errors && result?.postMessage === null) {
                        this.updateSendMessageState({
                            sendStatus: 'fail',
                            sendMessage: undefined,
                            postResponse: undefined,
                            sendError: errors
                        });
                        this.updateErrorMessageStatus({
                            status: 'unsent',
                            id: ''
                        });
                    }
                })
            );
        })
    ));

    constructor(
        private apollo: Apollo
    ) {
        super({
            dialogues: [],
            fetchLatestStatus: undefined,
            fetchNewerMessageStatus: undefined,
            fetchOlderMessageStatus: undefined,
            postResponse: undefined,
            sendError: undefined,
            sendMessage: undefined,
            sendStatus: undefined
        } as DialogueComponentState);
    }
}
