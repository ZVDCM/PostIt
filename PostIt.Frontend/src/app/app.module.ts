import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AccountModule } from './features/account/account.module';
import { HomeModule } from './features/home/home.module';
import { LoadingService } from './shared/services/loading.service';
import { MessageService } from 'primeng/api';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { accessTokenReducer } from './core/state/access-token/access-token.reducer';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        SharedModule,
        AccountModule,
        HomeModule,
        StoreModule.forRoot({ accessToken: accessTokenReducer }, {}),
        EffectsModule.forRoot([]),
        StoreRouterConnectingModule.forRoot(),
    ],
    bootstrap: [AppComponent],
    providers: [LoadingService, MessageService],
})
export class AppModule {}
