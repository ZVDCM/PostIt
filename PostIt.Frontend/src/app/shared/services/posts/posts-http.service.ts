import {
    HttpClient,
    HttpErrorResponse,
    HttpParams,
} from '@angular/common/http';
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
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ProgressService } from 'src/app/shared/services/progress.service';
import { IPostQuery, IPostQueryPayload } from '../../../core/models/posts.model';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class PostsHttpService {
    private _url: string =
        this._serverConstants.serverApi + this._homeConstants.postsEndpoint;
    private _posts$$: Subject<IPostQuery> = new Subject<IPostQuery>();
    private _cancelRequest$$: Subject<void> = new Subject<void>();

    constructor(
        private _httpClient: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _homeConstants: HomeConstantsService,
        private _loading: LoadingService,
        private _progress: ProgressService,
        private _messageService: MessageService
    ) {}

    public watchPosts$(): Observable<IPostQueryPayload> {
        return this._posts$$.asObservable().pipe(
            tap(() => {
                this._loading.startLoading();
                this._progress.isCancelled = true;
            }),
            switchMap((query: IPostQuery) =>
                this._getAllPosts$(query).pipe(
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
                    switchMap(() => this.watchPosts$())
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

    public getAllPosts(query: IPostQuery): void {
        this._posts$$.next(query);
    }

    private _getAllPosts$(query: IPostQuery): Observable<IPostQueryPayload> {
        let params = new HttpParams().set('pageSize', '1000');

        for (const [key, value] of Object.entries(query)) {
            params = params.set(key, value.toString());
        }

        return this._httpClient
            .get<IPostQueryPayload>(this._url, { params })
            .pipe(
                map((payload) => {
                    payload.items.map((item) => {
                        item.createdOnUtc = new Date(item.createdOnUtc);
                        item.modifiedOnUtc = new Date(item.modifiedOnUtc);
                        item.likes.map((like) => {
                            like.createdOnUtc = new Date(like.createdOnUtc);
                            return like;
                        });
                        return item;
                    });
                    return payload;
                })
            );
    }
}
