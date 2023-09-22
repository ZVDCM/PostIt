export interface IUserState {
    value: IUser;
}

export type IUserPayload = IUser;

export interface IUser {
    id: string;
    username: string;
    email: string;
    isVerified: boolean;
    role: string;
    followings: IFollow[];
    followers: IFollow[];
    createdOnUtc: Date;
}

export interface IFollow {
    followId: string;
    username: string;
}
