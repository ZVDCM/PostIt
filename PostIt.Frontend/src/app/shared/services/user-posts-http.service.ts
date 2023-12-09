import { Injectable } from '@angular/core';
import { IPostQuery, IPostQueryPayload } from '../../core/models/posts.model';
import {
    Observable,
    Subject,
    catchError,
    filter,
    finalize,
    of,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';
import {
    HttpClient,
    HttpErrorResponse,
    HttpParams,
} from '@angular/common/http';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ProgressService } from 'src/app/shared/services/progress.service';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class UserPostsHttpService {
    private _url: string =
        this._serverConstants.serverApi + this._homeConstants.userPostsEndpoint;
    private _posts$$: Subject<[string, IPostQuery]> = new Subject<
        [string, IPostQuery]
    >();
    private _cancelRequest$$: Subject<void> = new Subject<void>();

    constructor(
        private _httpClient: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _homeConstants: HomeConstantsService,
        private _loading: LoadingService,
        private _progress: ProgressService,
        private _messageService: MessageService
    ) {}

    public watchUserPosts$(): Observable<IPostQueryPayload> {
        return this._posts$$.asObservable().pipe(
            tap(() => {
                this._loading.startLoading();
                this._progress.isCancelled = true;
            }),
            switchMap(([userId, query]: [string, IPostQuery]) =>
                this.getAllUserPosts$(userId, query).pipe(
                    takeUntil(this._cancelRequest$$),
                    tap(() => {
                        this._loading.endLoading();
                        this._progress.isCancelled = false;
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
                    switchMap(() => this.watchUserPosts$())
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

    public getAllUserPosts(userId: string, query: IPostQuery): void {
        this._posts$$.next([userId, query]);
    }

    private getAllUserPosts$(
        userId: string,
        query: IPostQuery
    ): Observable<IPostQueryPayload> {
        let params = new HttpParams().set('pageSize', '1000');

        for (const [key, value] of Object.entries(query)) {
            params = params.set(key, value.toString());
        }

        return this._httpClient.get<IPostQueryPayload>(
            `${this._url}/${userId}`,
            { params }
        );
    }
}
