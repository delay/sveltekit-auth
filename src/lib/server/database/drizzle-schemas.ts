import { pgTable, text, timestamp, boolean, real, serial, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const userTable = pgTable('users', {
	id: text('id').notNull().primaryKey(),
	provider: text('provider').notNull().default('email'),
	providerId: text('provider_id').notNull().default(''),
	email: text('email').notNull().unique(),
	firstName: text('firstname').notNull(),
	lastName: text('lastname').notNull(),
	role: text('role').notNull().default('USER'),
	verified: boolean('verified').notNull().default(false),
	receiveEmail: boolean('receive_email').notNull().default(true),
	password: text('password'),
	token: text('token').unique(),
	producerId: integer('producer_id').unique(),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull(),
	updatedAt: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const sessionTable = pgTable('sessions', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id').notNull().references(() => userTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export type User = typeof userTable.$inferInsert;
export type UpdateUser = Partial<typeof userTable.$inferInsert>;
export type Session = typeof sessionTable.$inferInsert;


export const producerTable = pgTable('producers', {
    id: serial('id').notNull().primaryKey(),
    userId: text('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade' }),
    companyName: text('company_name').notNull(),
    firstName: text('firstname'),
    lastName: text('lastname'),
    shortDescription: text('short_description'),
    description: text('description'),
    postCode: integer('post_code').notNull(),
    city: text('city'),
    address: text('address'),
    category: text('category'),
    email: text('email'),
    phoneNumber1: text('phone_number_1'),
    phoneNumber2: text('phone_number_2'),
    siretNumber: text('siret_number'),
    website1: text('website_1'),
    website2: text('website_2'),
    website3: text('website_3'),
    createdAt: timestamp('created_at', {
        withTimezone: true,
        mode: 'date'
    }).notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at', {
        withTimezone: true,
        mode: 'date'
    }).notNull().default(sql`now()`),
    latitude: real('latitude').notNull().default(sql`0.0`),
    longitude: real('longitude').notNull().default(sql`0.0`)
});

export type Producer = typeof producerTable.$inferInsert;
export type UpdateProducer = Partial<typeof producerTable.$inferInsert>;



