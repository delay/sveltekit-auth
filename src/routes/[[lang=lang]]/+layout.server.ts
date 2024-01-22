import type { AvailableLanguageTag } from '$paraglide/runtime';
import { loadFlash } from 'sveltekit-flash-message/server';
export const load = loadFlash(async (event: { locals: { user: Lucia.UserAttributes, lang: AvailableLanguageTag } }) => {
    return { user: event.locals.user, lang: event.locals.lang };
});
