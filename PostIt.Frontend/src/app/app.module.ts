import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AccountModule } from './features/account/account.module';
import { HomeModule } from './features/home/home.module';
import { UserService } from './shared/services/user.service';
import { LoadingService } from './shared/services/loading.service';
import { MessageService } from 'primeng/api';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        SharedModule,
        AccountModule,
        HomeModule,
    ],
    bootstrap: [AppComponent],
    providers: [UserService, LoadingService, MessageService],
})
export class AppModule {}
