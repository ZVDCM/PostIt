import { Injectable } from '@angular/core';
import {
    Observable,
    Subject,
    catchError,
    filter,
    finalize,
    of,
    switchMap,
    tap,
} from 'rxjs';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { IUpdateProfile } from './update-profile.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IUserPayload } from 'src/app/core/state/user/user.model';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { UserActions } from 'src/app/core/state/user/user.actions';

@Injectable({
    providedIn: 'root',
})
export class UpdateProfileHttpService {
    private readonly _url: string =
        this._serverConstants.serverApi +
        this._homeConstants.updateProfileEndpoint;
    private _updateProfile$$: Subject<IUpdateProfile> =
        new Subject<IUpdateProfile>();

    public isLoading: boolean = false;
    public isCancelled: boolean = false;

    constructor(
        private _httpClient: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _homeConstants: HomeConstantsService,
        private _loading: LoadingService,
        private _messageService: MessageService,
        private _store: Store
    ) {}

    public watchUpdateProfile$(): Observable<void> {
        return this._updateProfile$$.asObservable().pipe(
            switchMap((user: IUpdateProfile) =>
                this.updateProfileUser(user).pipe(
                    tap((_) => {
                        this.isLoading = this._loading.endLoading();
                        this.isCancelled = false;
                    }),
                    tap((data: IUserPayload) => {
                        this._store.dispatch(
                            UserActions.setUser({
                                user: data,
                            })
                        );
                    }),
                    tap((_) => {
                        this._messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Profile update was successful',
                        });
                    })
                )
            ),
            catchError((err) =>
                of(err).pipe(
                    filter((err) => err instanceof HttpErrorResponse),
                    tap((_) => {
                        this.isLoading = this._loading.endLoading();
                        this.isCancelled = false;
                    }),
                    tap((err) => {
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Error in updating profile',
                        });
                    })
                )
            ),
            finalize(() => {
                if (this.isCancelled) {
                    this._loading.isCancelled = true;
                }
            })
        );
    }

    public updateProfile(user: IUpdateProfile): void {
        this._updateProfile$$.next(user);
    }

    private updateProfileUser(user: IUpdateProfile): Observable<IUserPayload> {
        return this._httpClient.post<IUserPayload>(this._url, user);
    }
}
