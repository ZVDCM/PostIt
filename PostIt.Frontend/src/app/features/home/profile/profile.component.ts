import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/core/state/user/user.model';
import { selectUser } from 'src/app/core/state/user/user.selectors';

@Component({
    selector: 'app-profile',
    template: ` <ng-container *ngIf="user$ | async as user">
        <section>
            <header>
                <h1>{{ user.username }}</h1>
                <h3>{{ user.email }}</h3>
            </header>
        </section>
    </ng-container>`,
    styles: [
        `
            :host {
                @apply w-full;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
    public user$: Observable<IUser> = new Observable<IUser>();

    constructor(private _store: Store) {
        this.user$ = this._store.select(selectUser);
    }
}
