import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-posts',
    template: `
        <section>
            <p-tabMenu
                [model]="items"
                [activeItem]="items[0]"
                pRipple
            ></p-tabMenu>
            <section>
                <router-outlet />
            </section>
        </section>
    `,
    styles: [
        `
            :host {
                @apply w-full;

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

    constructor() {
        this.items = [
            { label: 'For you', routerLink: 'foryou' },
            { label: 'Following', routerLink: 'following' },
        ];
    }
}
