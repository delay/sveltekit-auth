import { eq } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { producerTable, userTable } from '$lib/server/database/drizzle-schemas';
import type { User, UpdateUser } from '$lib/server/database/drizzle-schemas';
import { getProducerByEmail } from '$lib/server/database/producer-model'

export const getUserByEmail = async (email: string) => {
	const user = await db?.select().from(userTable).where(eq(userTable.email, email));
	if (!user || user.length === 0) {
		return null;
	} else {
		return user[0];
	}
};

export const getUserByToken = async (token: string) => {
	const user = await db?.select().from(userTable).where(eq(userTable.token, token));
	if (!user || user.length === 0) {
		return null;
	} else {
		return user[0];
	}
};

export const updateUser = async (id: string, user: UpdateUser) => {
	const result = await db?.update(userTable).set(user).where(eq(userTable.id, id)).returning();
	if (!result || result.length === 0) {
		return null;
	} else {
		return result[0];
	}
};

export const createUser = async (user: User) => {
	const result = await db?.insert(userTable).values(user).onConflictDoNothing().returning();
	if (!result || result.length === 0) {
		return null;
	} else {
		return result[0];
	}
};

export const tryLink2Producer = async (user: User) => {
	console.log("tryLink2Producer(",user,")");
	const producer = await getProducerByEmail(user.email);
	if (producer) {
		console.log("tryLink2Producer(",user,") => ",producer)
		await updateUser(user.id, { producerId: producer.id });
		await db?.update(producerTable).set({userId:user.id})
			.where(eq(producerTable.email, user.email));
	} else {
		console.log("tryLink2Producer(",user,") => No");
	}
};
