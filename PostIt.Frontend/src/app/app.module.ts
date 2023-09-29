import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './features/home/home.module';
import { LoginModule } from './features/login/login.module';
import { StoreModule } from '@ngrx/store';
import { ProgressService } from './shared/services/progress.service';
import { MessageService } from 'primeng/api';

import { AppComponent } from './app.component';
import { accessTokenReducer } from './core/state/access-token/access-token.reducer';
import { userReducer } from './core/state/user/user.reducer';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { LoadingService } from './shared/services/loading.service';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        SharedModule,
        LoginModule,
        HomeModule,
        StoreModule.forRoot({
            accessToken: accessTokenReducer,
            user: userReducer,
        }),
    ],
    bootstrap: [AppComponent],
    providers: [
        ProgressService,
        LoadingService,
        MessageService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
    ],
})
export class AppModule {}
