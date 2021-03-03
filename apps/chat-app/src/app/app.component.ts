import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { initChannels, initUsers } from './core/store/actions/core.actions';
import { AppState } from './core/store/app.state';

@Component({
    selector: 'nx-anymind-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'chat-app';
    constructor(private store: Store<AppState>) {}

    ngOnInit() {
        this.store.dispatch(initUsers());
        this.store.dispatch(initChannels());
    }
}
