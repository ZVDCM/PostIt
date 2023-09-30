import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeRoutingModule } from './features/home/home-routing.module';
import { NotfoundComponent } from './features/not-found/not-found.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { ForgotPasswordRoutingModule } from './features/forgot-password/forgot-password-routing.module';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', component: NotfoundComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        HomeRoutingModule,
        ForgotPasswordRoutingModule,
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
