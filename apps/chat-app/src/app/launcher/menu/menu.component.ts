import { Component, OnInit } from '@angular/core';
import { User } from '../../core/model/core.interface';

@Component({
    selector: 'nx-anymind-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
    users: User[];
    selectedUserId: string;

    ngOnInit() {
        this.users = [
            {
                id: 'Sam'
            },
            {
                id: 'Joyse'
            },
            {
                id: 'Russell'
            }
        ];
        this.selectedUserId = this.users[0].id;
    }

}

