import { Injectable } from '@angular/core';
import { IUser } from 'src/app/core/state/user/user.model';

@Injectable({
    providedIn: 'root',
})
export class OneShotAuthService {
    public email: string = '';
    public user: IUser = {} as IUser;
    public accessToken: string = '';
}
