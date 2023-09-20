import { createReducer, on } from '@ngrx/store';
import { IAccessTokenState } from './access-token.model';
import { AccessTokenApiActions } from './access-token.actions';

const initialState: IAccessTokenState = {} as IAccessTokenState;

export const accessTokenReducer = createReducer(
    initialState,
    on(AccessTokenApiActions.setAccessToken, (_, action) => ({
        value: action.accessToken,
    }))
);
