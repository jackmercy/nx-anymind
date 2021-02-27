import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

const GET_USER = gql`
    query GetUser($userId: ID!){
        user(id: $userId) {
            id
            username
            email
            address {
                geo {
                    lat
                    lng
                }
            }
        }
    }
`;


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    loading: boolean = false;
    userData: Observable<any>;

    // private querySubscription: Subscription = new Subscription();

    constructor(private apollo: Apollo) { }

    ngOnInit() {
        this.apollo.watchQuery<any>({
            query: GET_USER,
            errorPolicy: 'all',
            fetchPolicy: 'network-only',
            variables: {
                userId: 1
            },
            // pollInterval: 500, sync with server (execute the query periodically at a specified interval),
            // errorPolicy: handle error here
        })
            // .valueChanges.pipe(
            //     map(({ data, errors, error, networkStatus }) => {
            //         console.log(errors);
            //         console.log(error);
            //         console.log(networkStatus);
            //         return data.user;
            //     })
            // );
            .valueChanges.subscribe(
                ({ data, error, errors }) => {
                    console.log({ error });
                    console.log({ errors });
                    console.log(data);
                    return data;
                },
                catchError(err => of(console.log(err)))
            );
    }

    // ngOnDestroy() {
    //     // this.querySubscription.unsubscribe();
    // }
}
