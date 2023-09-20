import { IUser } from "src/app/core/state/user/user.model";

export interface ILogin {
    email: string;
    password: string;
}

export interface ILoginPayload {
    accessToken: string;
    user: IUser;
}
