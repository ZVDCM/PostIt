import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountRoutingModule } from './features/account/account-routing.module';
import { HomeRoutingModule } from './features/home/home-routing.module';
import { NotFoundRoutingModule } from './features/not-found/not-found-routing.module';

const routes: Routes = [
    { path: '', redirectTo: 'account/login', pathMatch: 'full' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        AccountRoutingModule,
        HomeRoutingModule,
        NotFoundRoutingModule,
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
