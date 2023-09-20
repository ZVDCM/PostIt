import { createReducer, on } from '@ngrx/store';
import { IUserState } from './user.model';
import { UserApiActions } from './user.actions';

const initialState: IUserState = {} as IUserState;

export const userReducer = createReducer(
    initialState,
    on(UserApiActions.setUser, (_, action) => ({ value: action.user }))
);
