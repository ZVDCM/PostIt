import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountRoutingModule } from './features/account/account-routing.module';
import { HomeRoutingModule } from './features/home/home-routing.module';
import { NotfoundComponent } from './shared/components/not-found.component';

const routes: Routes = [
    { path: '', redirectTo: 'account/login', pathMatch: 'full' },
    { path: '**', component: NotfoundComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        AccountRoutingModule,
        HomeRoutingModule,
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
