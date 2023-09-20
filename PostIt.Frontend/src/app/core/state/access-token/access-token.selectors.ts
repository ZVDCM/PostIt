import { createFeatureSelector } from "@ngrx/store";
import { IAccessTokenState } from './access-token.model';

export const selectAccessToken =
    createFeatureSelector<IAccessTokenState>('accessToken');