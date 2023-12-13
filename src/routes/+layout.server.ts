import { loadFlashMessage } from 'sveltekit-flash-message/server';
export const load = loadFlashMessage(async (event: { locals: { user: Lucia.UserAttributes } }) => {
    return { user: event.locals.user };
});
