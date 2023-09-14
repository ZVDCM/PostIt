import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountModule } from './features/account/account.module';
import { NotfoundModule } from './features/notfound/notfound.module';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AppRoutingModule, AccountModule, NotfoundModule],
    bootstrap: [AppComponent],
})
export class AppModule {}
