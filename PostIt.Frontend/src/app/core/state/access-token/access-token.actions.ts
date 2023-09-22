import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AccessTokenActions = createActionGroup({
    source: 'Access Token',
    events: {
        setAccessToken: props<{ accessToken: string }>(),
        removeAccessToken: emptyProps(),
    },
});
