import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IUser } from './user.model';

export const UserActions = createActionGroup({
    source: 'User',
    events: {
        setUser: props<{ user: IUser }>(),
        removeUser: emptyProps(),
    },
});
