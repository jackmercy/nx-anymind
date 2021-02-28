import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './master/master.component';


const routes: Routes = [
    { 
        path: '',
        component: MasterComponent,
        children: [
            { path: '', redirectTo: 'chat', pathMatch: 'full' },
            {
                path: 'chat',
                loadChildren: () => import('../conversation/conversation.module').then(m => m.ConversationModule)
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LauncherRoutingModule { }
