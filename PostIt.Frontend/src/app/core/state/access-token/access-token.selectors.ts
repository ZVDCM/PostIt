import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAccessTokenState } from './access-token.model';

const selectAccessTokenState =
    createFeatureSelector<IAccessTokenState>('accessToken');

export const selectAccessToken = createSelector(
    selectAccessTokenState,
    (state: IAccessTokenState) => state.value
);
