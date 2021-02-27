import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { onError } from '@apollo/client/link/error';

const uri = 'https://graphqlzero.almansi.me/api';

const linkError = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );
    if (networkError) {
        console.log(`[Network error]:`);
        console.log({ networkError });
    }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
    return {
        // link: httpLink.create({ uri }),
        link: ApolloLink.from([linkError, httpLink.create({ uri })]),
        cache: new InMemoryCache(),
        defaultOptions: {
            watchQuery: {
                errorPolicy: 'all'
            }
        }
    };
}

@NgModule({
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink],
        },
    ],
})
export class GraphQLModule { }
