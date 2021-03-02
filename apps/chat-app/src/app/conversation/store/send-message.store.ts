import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { ImmerComponentStore } from 'ngrx-immer/component-store';
import { switchMap, tap } from 'rxjs/operators';
import { Message } from '../../core/model/core.interface';
import { channelId, qlStatus, userId } from '../../core/type/core.type';



export type PostMessageRequest = {
    channelId: channelId;
    text: string;
    userId: userId;
};

export interface SendMessageComponentState {
    sendStatus: qlStatus;
    sendMessage: PostMessageRequest;
    postResponse: Message;
    error: any;
}

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

@Injectable()
export class SendMessageComponentStore extends ImmerComponentStore<SendMessageComponentState> {
    readonly viewModel$ = this.select(this.state$, ({ sendStatus, postResponse, error, sendMessage }) => ({
        postResponse,
        error,
        sendMessage,
        isLoading: sendStatus === 'loading',
        isSuccess: sendStatus === 'success',
        isFail: sendStatus === 'fail'
    }));

    readonly updateSendStatus = this.updater<qlStatus>((state, status) => {
        state.sendStatus = status;
        if (status === 'success') {
            state.error = undefined;
        }
    });

    readonly updateSendMessage = this.updater<PostMessageRequest>((state, message) => {
        state.sendMessage = message;
    });

    readonly updateError = this.updater<any>((state, error) => {
        state.error = error;
    });

    readonly updatePostResponse = this.updater<Message>((state, response) => {
        state.postResponse = response;
    });

    readonly sendMessageEffect = this.effect<{ reqBody: PostMessageRequest }>(event$ => event$.pipe(
        tap(({ reqBody }) => {
            this.updateSendMessage(reqBody);
            this.updateSendStatus('loading');
        }),
        switchMap(({ reqBody }) => {
            // cannot identify which message was unsent if user sent multiple messages
            // => limit one message at a time for now b/c the error respone does not 
            // give any information about the message that cause error.
            return this.apollo.mutate({
                mutation: PostMessageQL,
                variables: {
                    ...reqBody
                }
            }).pipe(
                tap(({ data, errors }) => {
                    if (!errors) {
                        this.updateSendStatus('success');
                        this.updateSendMessage(undefined);
                        this.updatePostResponse(data as Message);
                    } else {
                        this.updateError(errors);
                        this.updateSendStatus('fail');
                    }
                })
            );
        })
    ));

    constructor(
        private apollo: Apollo
    ) {
        super({
            sendStatus: undefined, localId: undefined, 
            postResponse: undefined, error: undefined,
            sendMessage: undefined
        } as SendMessageComponentState)
    }
}

