import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeRoutingModule } from './features/home/home-routing.module';
import { NotfoundComponent } from './shared/components/not-found.component';
import { LoginRoutingModule } from './features/login/login-routing.module';

const routes: Routes = [
    { path: '', redirectTo: 'login/auth', pathMatch: 'full' },
    { path: '**', component: NotfoundComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        LoginRoutingModule,
        HomeRoutingModule,
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
