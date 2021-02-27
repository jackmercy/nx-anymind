import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { MasterComponent } from './master/master.component';
import { LauncherRoutingModule } from './launcher-routing.module';


@NgModule({
    declarations: [MenuComponent, MasterComponent, ],
    imports: [
        CommonModule,
        LauncherRoutingModule
    ]
})
export class LauncherModule { }
