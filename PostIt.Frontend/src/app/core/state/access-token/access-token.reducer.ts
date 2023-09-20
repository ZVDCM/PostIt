import { createReducer, on } from '@ngrx/store';
import { IAccessToken } from './access-token.model';
import { AccessTokenApiActions } from './access-token.actions';

export const initialState: IAccessToken = {} as IAccessToken;

export const accessTokenReducer = createReducer(
    initialState,
    on(AccessTokenApiActions.gotAccessToken, (_, action) => ({
        value: action.accessToken,
    }))
);
