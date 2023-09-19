import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountModule } from './account/account.module';
import { NotfoundModule } from './not-found/not-found.module';

import { AccountComponent } from './account/account.component';
import { NotfoundComponent } from './not-found/not-found.component';
import { PostsModule } from './posts/posts.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, AccountModule, NotfoundModule, PostsModule],
    exports: [AccountComponent, NotfoundComponent, PostsModule],
})
export class FeaturesModule {}
