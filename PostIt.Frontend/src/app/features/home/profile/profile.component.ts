import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/core/state/user/user.model';
import { selectUser } from 'src/app/core/state/user/user.selectors';
import { Clipboard } from '@angular/cdk/clipboard';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-profile',
    template: ` <ng-container *ngIf="user$ | async as user">
        <header
            class="flex flex-col gap-4 px-10 py-[3.4rem] bg-[var(--surface-card)] border-b-2 border-[var(--surface-border)]"
        >
            <section class="flex items-center">
                <div
                    class="group flex items-center gap-4 cursor-pointer"
                    (click)="onUsernameClick(user.username)"
                >
                    <i class="pi pi-at mt-1" style="font-size: 1.3rem;"></i>
                    <h1
                        class="text-3xl font-extrabold tracking-wide whitespace-nowrap group-hover:text-[var(--primary-color)]"
                    >
                        {{ user.username }}
                    </h1>
                </div>
                <i
                    class="pi pi-verified ml-auto mt-1 text-[var(--primary-color)]"
                    style="font-size: 1.3rem;"
                ></i>
            </section>
            <section class="flex justify-between items-center">
                <span class="flex items-center gap-2 text-slate-600">
                    <i class="pi pi-calendar"></i>
                    Joined {{ user.createdOnUtc | date : 'MMM dd, yyyy' }}
                </span>
                <div class="flex justify-between items-center gap-4">
                    <i
                        class="pi pi-users text-slate-600"
                        style="font-size: 1.3rem;"
                    ></i>
                    <div
                        class="group flex items-center cursor-pointer hover:underline"
                    >
                        {{ user.followings.length | number }}
                        &nbsp;
                        <span
                            class="text-slate-600 group-hover:text-[var(--primary-color)]"
                        >
                            Following
                        </span>
                    </div>
                    <div
                        class="group flex items-center cursor-pointer hover:underline"
                    >
                        {{ user.followers.length | number }}
                        &nbsp;
                        <span
                            class="text-slate-600 group-hover:text-[var(--primary-color)]"
                            >Followers
                        </span>
                    </div>
                </div>
            </section>
        </header>
        <section class="py-10 flex flex-col gap-4">
            <app-create-post />
        </section>
    </ng-container>`,
    styles: [``],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
    public user$: Observable<IUser> = new Observable<IUser>();

    constructor(
        private _store: Store,
        private _clipboard: Clipboard,
        private _messageService: MessageService
    ) {
        this.user$ = this._store.select(selectUser);
    }

    public onUsernameClick(username: string): void {
        this._clipboard.copy(username);
        this._messageService.add({
            severity: 'info',
            summary: 'Copied to Clipboard',
            detail: 'You have copied username to clipboard',
        });
    }
}
