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
    tap,
} from 'rxjs';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { IUpdateProfile } from './edit-profile.model';
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
export class EditProfileHttpService {
    private readonly _url: string =
        this._serverConstants.serverApi +
        this._homeConstants.editProfileEndpoint;
    private _updateProfile$$: Subject<IUpdateProfile> =
        new Subject<IUpdateProfile>();

    public isLoading: boolean = false;
    public isCancelled: boolean = false;

    constructor(
        private _httpClient: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _homeConstants: HomeConstantsService,
        private _store: Store,
        private _loading: LoadingService,
        private _progress: ProgressService,
        private _messageService: MessageService
    ) {}

    public watchEditProfile$(): Observable<void> {
        return this._updateProfile$$.asObservable().pipe(
            tap(() => {
                this._loading.startLoading();
                this._progress.isCancelled = true;
            }),
            switchMap((user: IUpdateProfile) =>
                this.editProfileUser(user).pipe(
                    tap((_) => {
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
                        this._loading.endLoading();
                        this._progress.isCancelled = false;
                    }),
                    tap((err) => {
                        switch (err.status) {
                            case 400: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Update Error',
                                    detail: 'Invalid form data',
                                });
                                break;
                            }
                            case 409: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Update Error',
                                    detail: 'Email already in use',
                                });
                                break;
                            }
                            default: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Server Error',
                                    detail: 'Something went wrong',
                                });
                            }
                        }
                    }),
                    switchMap(() => this.watchEditProfile$())
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

    public editProfile(user: IUpdateProfile): void {
        this._updateProfile$$.next(user);
    }

    private editProfileUser(user: IUpdateProfile): Observable<IUserPayload> {
        return this._httpClient.put<IUserPayload>(this._url, user);
    }
}
