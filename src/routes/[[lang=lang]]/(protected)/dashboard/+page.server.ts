export const load = async (event) => {
    //I only have this function here so it will check page again 
    //instead of keeping it cache if it was client side only.
    //If only client side, it might still show the page even 
    //if the user has logged out.
    const session = await event.locals.auth.validate();
	const user  = session?.user;
	return user;
};