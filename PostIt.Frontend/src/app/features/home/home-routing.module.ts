import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ForYouComponent } from './for-you/for-you.component';

const routes: Routes = [
    { path: 'home', redirectTo: 'home/foryou', pathMatch: 'full' },
    {
        path: 'home',
        component: HomeComponent,
        children: [
            {
                path: 'foryou',
                component: ForYouComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomeRoutingModule {}
