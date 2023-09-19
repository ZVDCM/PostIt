import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotfoundComponent } from './not-found.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [NotfoundComponent],
    imports: [CommonModule, RouterModule],
    exports: [NotfoundComponent],
})
export class NotfoundModule {}
