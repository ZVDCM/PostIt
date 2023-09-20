import { createActionGroup, props } from '@ngrx/store';
import { IUser } from './user.model';

export const UserApiActions = createActionGroup({
    source: 'User API',
    events: {
        'Set User': props<{ user: IUser }>(),
    },
});
