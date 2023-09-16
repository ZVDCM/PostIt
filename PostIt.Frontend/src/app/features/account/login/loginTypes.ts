import { IUser } from 'src/app/shared/types/userType';

export interface ILogin {
    email: string;
    password: string;
}

export interface ILoginPayload {
    accessToken: string;
    user: IUser;
}
