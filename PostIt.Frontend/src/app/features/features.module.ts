import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountModule } from './account/account.module';
import { NotfoundModule } from './not-found/not-found.module';

import { AccountComponent } from './account/account.component';
import { NotfoundComponent } from './not-found/not-found.component';

@NgModule({
    declarations: [],
    imports: [CommonModule, AccountModule, NotfoundModule],
    exports: [AccountComponent, NotfoundComponent],
})
export class FeaturesModule {}
