import { Injectable } from '@angular/core';
import {
    Observable,
    Subject,
    catchError,
    filter,
    finalize,
    map,
    of,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { IUpdateProfile } from '../../../core/models/update-profile.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IUserPayload } from 'src/app/core/state/user/user.model';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { UserActions } from 'src/app/core/state/user/user.actions';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ProgressService } from 'src/app/shared/services/progress.service';

@Injectable({
    providedIn: 'root',
})
export class UpdateProfileHttpService {
    private readonly _url: string =
        this._serverConstants.serverApi +
        this._homeConstants.updateProfileEndpoint;
    private _updateProfile$$: Subject<IUpdateProfile> =
        new Subject<IUpdateProfile>();
    private _cancelRequest$$: Subject<void> = new Subject<void>();

    constructor(
        private _httpClient: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _homeConstants: HomeConstantsService,
        private _store: Store,
        private _loading: LoadingService,
        private _progress: ProgressService,
        private _messageService: MessageService
    ) {}

    public watchUpdateProfile$(): Observable<void> {
        return this._updateProfile$$.asObservable().pipe(
            tap(() => {
                this._loading.startLoading();
                this._progress.isCancelled = true;
            }),
            switchMap((user: IUpdateProfile) =>
                this._updateProfile$(user).pipe(
                    takeUntil(this._cancelRequest$$),
                    tap(() => {
                        this._loading.endLoading();
                        this._progress.isCancelled = false;
                    }),
                    map((data: IUserPayload) => {
                        this._store.dispatch(
                            UserActions.setUser({
                                user: data,
                            })
                        );
                    }),
                    tap(() => {
                        this._messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Update was successful',
                        });
                    })
                )
            ),
            catchError((err) =>
                of(err).pipe(
                    filter((err) => err instanceof HttpErrorResponse),
                    tap(() => {
                        this._loading.endLoading();
                        this._progress.isCancelled = false;
                    }),
                    tap((err) => {
                        switch (err.status) {
                            case 400: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Invalid form data',
                                });
                                break;
                            }
                            case 409: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Email already in use',
                                });
                                break;
                            }
                            default: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail:
                                        err.error?.detail ??
                                        'Something went wrong',
                                });
                                break;
                            }
                        }
                    }),
                    switchMap(() => this.watchUpdateProfile$())
                )
            ),
            finalize(() => {
                if (this._progress.isCancelled) {
                    this._progress.isCancelled = null;
                    this._loading.endLoading();
                }
            })
        );
    }

    public cancelRequest(): void {
        if (this._loading.isLoading) {
            this._progress.isCancelled = null;
            this._loading.endLoading();
            this._cancelRequest$$.next();
        }
    }

    public updateProfile(user: IUpdateProfile): void {
        this._updateProfile$$.next(user);
    }

    private _updateProfile$(user: IUpdateProfile): Observable<IUserPayload> {
        return this._httpClient.put<IUserPayload>(this._url, user);
    }
}
