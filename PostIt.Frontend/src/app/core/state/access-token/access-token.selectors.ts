import { createFeatureSelector } from "@ngrx/store";
import { IAccessToken } from "./access-token.model";

export const selectAccessToken = createFeatureSelector<IAccessToken>('accessToken');