import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountRoutingModule } from './features/account/account-routing.module';
import { NotfoundComponent } from './features/notfound/notfound.component';

const routes: Routes = [
    { path: '', redirectTo: 'account/login', pathMatch: 'full' },
    { path: '**', component: NotfoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes), AccountRoutingModule],
    exports: [RouterModule],
})
export class AppRoutingModule {}
