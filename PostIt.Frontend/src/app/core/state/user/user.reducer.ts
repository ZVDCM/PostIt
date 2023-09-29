import { createReducer, on } from '@ngrx/store';
import { IUserState } from './user.model';
import { UserActions } from './user.actions';

const initialState: IUserState = {} as IUserState;

export const userReducer = createReducer(
    initialState,
    on(UserActions.setUser, (_, action) => ({ value: action.user })),
    on(UserActions.removeUser, () => initialState)
);
