import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FeaturesModule } from './features/features.module';

import { AppComponent } from './app.component';
import { UserService } from './shared/services/user.service';
import { SharedModule } from './shared/shared.module';
import { LoadingService } from './shared/services/loading.service';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AppRoutingModule, SharedModule, FeaturesModule],
    bootstrap: [AppComponent],
    providers: [UserService, LoadingService],
})
export class AppModule {}
