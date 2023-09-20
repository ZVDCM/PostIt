import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { selectAccessToken } from 'src/app/core/state/access-token/access-token.selectors';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';

@Component({
    selector: 'app-home',
    template: `
        <aside
            class="h-screen sticky top-0 flex flex-col flex-1 items-end"
            style="border-right: 1px solid var(--surface-border); background-color: var(--surface-ground)"
        >
            <nav class="h-full flex flex-col gap-5 py-10 pl-10">
                <header
                    [routerLink]="homeConstants.homeEndpoint"
                    class="cursor-pointer mb-14 pr-10 focus:outline-none"
                >
                    <h1
                        class="text-6xl font-extrabold tracking-widest rounded-none"
                    >
                        POST <span style="color: var(--primary-color)">IT</span>
                    </h1>
                </header>
                <button
                    pButton
                    class="nav-button"
                    [ngClass]="{ active: isPostsActive }"
                    (click)="onClickPosts()"
                >
                    <i class="pi pi-camera"></i>
                    <span>Posts</span>
                </button>
                <button
                    pButton
                    class="nav-button"
                    [ngClass]="{ active: isProfileActive }"
                    (click)="onClickProfile()"
                >
                    <i class="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                <div class="mt-auto mr-11">
                    <p-splitButton
                        class="w-full"
                        styleClass="w-full"
                        [menuStyle]="{ width: '100%' }"
                        label="JuanDelaCruz"
                        icon="pi pi-at"
                        [model]="items"
                    >
                        <ng-template pTemplate="dropdownicon">
                            <i class="pi pi-chevron-up"></i>
                        </ng-template>
                    </p-splitButton>
                </div>
            </nav>
        </aside>
        <div
            class="h-full w-full max-w-3xl"
            style="border-right: 1px solid var(--surface-border); background-color: var(--surface-ground)"
        >
            <router-outlet />
        </div>
        <aside class="h-screen sticky top-0 flex-1">
            <div class="flex flex-col p-10">
                <div class="p-inputgroup">
                    <input pInputText placeholder="Search" />
                    <button type="button" pButton icon="pi pi-search"></button>
                </div>
            </div>
            <div
                class="absolute bottom-0 right-0 flex flex-col items-end p-12 font-extrabold text-slate-600"
            >
                <div class="space-x-2">
                    <span>Z</span>
                    <span>V</span>
                    <span>D</span>
                    <span>C</span>
                    <span>M</span>
                </div>
                <div class="space-x-2">
                    <span>2</span>
                    <span>0</span>
                    <span>2</span>
                    <span>3</span>
                </div>
            </div>
        </aside>
    `,
    styles: [
        `
            :host {
                @apply h-full flex;

                .nav-button {
                    @apply flex items-center gap-4 text-gray-400 tracking-wider font-medium;

                    &.active {
                        background-color: var(--primary-color);
                        color: black;
                    }

                    background-color: var(--surface-card);
                    border: none;
                    border-radius: 0;
                    transition: all 0.2s;
                }

                p-toggleButton {
                    ::ng-deep .p-button {
                        @apply rounded-none border-0;

                        &:not(.p-highlight) {
                            .p-button-label {
                                @apply text-gray-400;
                            }
                        }

                        .p-button-label {
                            @apply ml-5;
                            flex: unset;
                        }
                    }
                }
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [HomeConstantsService],
})
export class HomeComponent {
    public items: MenuItem[] = [];
    public isPostsActive: boolean = true;
    public isProfileActive: boolean = false;

    constructor(
        public homeConstants: HomeConstantsService,
        private _store: Store
    ) {
        this._store.select(selectAccessToken).subscribe((accessToken) => {
            console.log(accessToken);
        });
        this.items = [
            {
                label: 'Update Profile',
                icon: 'pi pi-user',
                command: () => {},
            },
            {
                label: 'Update Password',
                icon: 'pi pi-lock',
                command: () => {},
            },
            { separator: true },
            { label: 'Logout', icon: 'pi pi-sign-out', routerLink: ['/setup'] },
        ];
    }

    public onClickPosts() {
        this.isPostsActive = true;
        this.isProfileActive = false;
        console.log(this.isPostsActive);
    }
    public onClickProfile() {
        this.isPostsActive = false;
        this.isProfileActive = true;
        console.log(this.isProfileActive);
    }
}
