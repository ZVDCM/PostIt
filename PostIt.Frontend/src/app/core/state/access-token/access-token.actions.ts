import { createActionGroup, props } from '@ngrx/store';

export const AccessTokenApiActions = createActionGroup({
    source: 'Access Token API',
    events: {
        'Set Access Token': props<{ accessToken: string }>(),
    },
});
