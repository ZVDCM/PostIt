export interface IPostItem {
    postId: string;
    userId: string;
    username: string;
    body: string;
    createdOnUtc: Date;
    modifiedOnUtc: Date;
    likesCount: number;
    commentsCount: number;
}

export interface IPostQuery {
    page: number;
}

export interface IPostQueryPayload {
    page: number;
    pageSize: number;
    totalCount: number;
    items: IPostItem[];
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface IUpdatePost {
    id: string;
    body: string;
}
