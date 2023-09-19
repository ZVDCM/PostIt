import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundRoutingModule } from './not-found-routing.module';

import { NotfoundComponent } from './not-found.component';

@NgModule({
    declarations: [NotfoundComponent],
    imports: [CommonModule, NotFoundRoutingModule],
    exports: [NotFoundRoutingModule],
})
export class NotFoundModule {}
