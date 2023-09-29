import { createReducer, on } from '@ngrx/store';
import { IAccessTokenState } from './access-token.model';
import { AccessTokenActions } from './access-token.actions';

const initialState: IAccessTokenState = {} as IAccessTokenState;

export const accessTokenReducer = createReducer(
    initialState,
    on(AccessTokenActions.setAccessToken, (_, action) => ({
        value: action.accessToken,
    })),
    on(AccessTokenActions.removeAccessToken, () => initialState)
);
