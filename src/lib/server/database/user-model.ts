import { eq } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { userTable } from '$lib/server/database/drizzle-schemas';
import type { User, UpdateUser } from '$lib/server/database/drizzle-schemas';

export const getUserByEmail = async (email: string) => {
	const user = await db.select().from(userTable).where(eq(userTable.email, email));
	if (user.length === 0) {
		return null;
	} else {
		return user[0];
	}
};

export const getUserByToken = async (token: string) => {
	const user = await db.select().from(userTable).where(eq(userTable.token, token));
	if (user.length === 0) {
		return null;
	} else {
		return user[0];
	}
};

export const updateUser = async (id: string, user: UpdateUser) => {
	const result = await db.update(userTable).set(user).where(eq(userTable.id, id)).returning();
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
};

export const createUser = async (user: User) => {
	const result = await db.insert(userTable).values(user).onConflictDoNothing().returning();
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
};
