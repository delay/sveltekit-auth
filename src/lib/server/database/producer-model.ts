import { eq } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { producerTable } from '$lib/server/database/drizzle-schemas';

export const getProducerByEmail = async (email: string) => {
	const producer = await db?.select().from(producerTable).where(eq(producerTable.email, email));
	if (!producer || producer.length === 0) {
		return null;
	} else {
		return producer[0];
	}
};
