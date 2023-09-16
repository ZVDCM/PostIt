import { IFollow } from './followType';

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
