import { loadFlash } from 'sveltekit-flash-message/server';
export const load = loadFlash(async (event: { locals: { user: Lucia.UserAttributes } }) => {
    return { user: event.locals.user };
});
