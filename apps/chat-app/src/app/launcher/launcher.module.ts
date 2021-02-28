import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { MasterComponent } from './master/master.component';
import { LauncherRoutingModule } from './launcher.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [MenuComponent, MasterComponent, ],
    imports: [
        CommonModule,
        LauncherRoutingModule,

        NgSelectModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class LauncherModule { }
