export interface ILikeItem {
    likeId: string;
    postId: string;
    userId: string;
    username: string;
    createdOnUtc: Date;
}

export interface IPostItem {
    postId: string;
    userId: string;
    username: string;
    body: string;
    createdOnUtc: Date;
    modifiedOnUtc: Date;
    likesCount: number;
    likes: ILikeItem[];
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

export interface IPost {
    body: string;
}
