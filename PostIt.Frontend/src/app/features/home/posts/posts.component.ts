import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { PostsHttpService } from './posts-http.service';

@Component({
    selector: 'app-posts',
    template: `
        <p-tabMenu [model]="items" [activeItem]="items[0]" pRipple></p-tabMenu>
        <section class="py-10 flex flex-col gap-4">
            <app-create-post />
            <router-outlet />
        </section>
    `,
    styles: [
        `
            :host {
                ::ng-deep .p-tabmenu .p-tabmenu-nav .p-tabmenuitem {
                    @apply flex-1;

                    a {
                        @apply w-full flex justify-center items-center tracking-wider;
                    }
                }
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent {
    public items: MenuItem[] = [];

    constructor(
        public loading: LoadingService,
        public postsHttp: PostsHttpService
    ) {
        this.items = [
            { label: 'For you', routerLink: 'foryou' },
            { label: 'Following', routerLink: 'following' },
        ];
    }
}