import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
    selector: 'app-posts',
    template: `<section></section>`,
    styles: [
        `
            :host {
                @apply w-full;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent {
    constructor(private _loading: LoadingService) {
        _loading.endLoading();
    }
}
