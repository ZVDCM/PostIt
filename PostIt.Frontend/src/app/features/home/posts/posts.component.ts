import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/core/state/user/user.model';
import { selectUser } from 'src/app/core/state/user/user.selectors';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { PostsHttpService } from './posts-http.service';

@Component({
    selector: 'app-posts',
    template: `
        <ng-container *ngIf="user$ | async as user">
            <p-tabMenu
                [model]="items"
                [activeItem]="items[0]"
                pRipple
            ></p-tabMenu>
            <section class="py-10 flex flex-col gap-4">
                <app-create-post />
                <router-outlet />
            </section>
        </ng-container>
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

                ::ng-deep p-fileUpload {
                    .p-fileupload-content {
                        @apply hidden;
                    }

                    .p-fileupload-buttonbar {
                        @apply border-0 h-min w-min p-0;

                        .p-button {
                            @apply m-0 p-4;

                            .p-button-icon {
                                @apply m-0;
                            }

                            .p-button-label {
                                @apply hidden;
                            }
                        }
                    }
                }
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent {
    public user$: Observable<IUser> = new Observable<IUser>();
    public items: MenuItem[] = [];
    public showModal: boolean = true;

    constructor(
        public loading: LoadingService,
        public postsHttp: PostsHttpService,
        private _store: Store
    ) {
        this.user$ = this._store.select(selectUser);
        this.items = [
            { label: 'For you', routerLink: 'foryou' },
            { label: 'Following', routerLink: 'following' },
        ];
    }

    public onSelect(event: any): void {
        console.log(event);
    }
}
