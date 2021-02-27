import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql/graphql.module';
import { HomeComponent } from './home/home.component';

@NgModule({
    declarations: [AppComponent, HomeComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        GraphQLModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
