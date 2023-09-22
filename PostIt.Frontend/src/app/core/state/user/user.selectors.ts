import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IUserState } from './user.model';

const selectUserState = createFeatureSelector<IUserState>('user');

export const selectUser = createSelector(
    selectUserState,
    (state: IUserState) => state.value ?? {}
);
