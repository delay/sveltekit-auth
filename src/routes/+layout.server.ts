export const load = async (event: { locals: { user: unknown } }) => {
    return { user: event.locals.user };
};
