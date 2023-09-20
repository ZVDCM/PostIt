import { createFeatureSelector } from '@ngrx/store';
import { IUserState } from './user.model';

export const selectUser = createFeatureSelector<IUserState>('user');
