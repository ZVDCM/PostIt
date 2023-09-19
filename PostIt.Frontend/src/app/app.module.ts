import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FeaturesModule } from './features/features.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
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
        FeaturesModule,
    ],
    bootstrap: [AppComponent],
    providers: [UserService, LoadingService, MessageService],
})
export class AppModule {}
