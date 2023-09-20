import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
    selector: 'app-posts',
    template: `
        <section>
            <p-tabMenu
                [model]="items"
                [activeItem]="items[0]"
                pRipple
            ></p-tabMenu>
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

    constructor(private _loading: LoadingService) {
        _loading.endLoading();
        this.items = [{ label: 'For you' }, { label: 'Following' }];
    }
}
