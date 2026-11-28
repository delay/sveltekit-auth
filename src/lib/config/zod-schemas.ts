import { z } from 'zod/v4';

export const userSchema = z.object({
	firstName: z
		.string({ error: 'First Name is required' })
		.min(1, { message: 'First Name is required' })
		.trim(),
	lastName: z
		.string({ error: 'Last Name is required' })
		.min(1, { message: 'Last Name is required' })
		.trim(),
	email: z
		.email({ message: 'Please enter a valid email address' }),
	password: z
		.string({ error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
		.trim(),
	confirmPassword: z
		.string({ error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
		.trim(),
	role: z
		.enum(['USER', 'PREMIUM', 'ADMIN'])
		.default('USER'),
	verified: z.boolean().default(false),
	terms: z.literal<boolean>(true, {
		error: () => ({ message: "You must accept the terms & privacy policy" }),
	}),
	token: z.string().optional(),
	receiveEmail: z.boolean().default(true),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional()
});

export type UserSchema = typeof userSchema;

export const userUpdatePasswordSchema = userSchema
	.pick({ password: true, confirmPassword: true })
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['confirmPassword']
			});
		}
	});

export type UserUpdatePasswordSchema = typeof userUpdatePasswordSchema;

export const producerSchema = z.object({
	companyName: z
		.string({ error: 'Company name is required' })
		.min(1, { message: 'Company name is required' })
		.max(100, { message: 'Company name must be less than 100 characters' })
		.trim(),
	firstName: z
		.string()
		.max(50, { message: 'First name must be less than 50 characters' })
		.trim()
		.optional()
		.or(z.literal('')),
	lastName: z
		.string()
		.max(50, { message: 'Last name must be less than 50 characters' })
		.trim()
		.optional()
		.or(z.literal('')),
	shortDescription: z
		.string()
		.max(200, { message: 'Short description must be less than 200 characters' })
		.trim(),
	description: z
		.string()
		.max(1000, { message: 'Description must be less than 1000 characters' })
		.trim(),
	postCode: z
		.coerce.number()
		.int({ message: 'Post code must be a valid number' })
		.min(1000, { message: 'Post code must have at least 4 digits' })
		.max(99999, { message: 'Post code must be 5 digits max' }),
	city: z
		.string()
		.max(100, { message: 'City must be less than 100 characters' })
		.trim(),
	address: z
		.string()
		.max(200, { message: 'Address must be less than 200 characters' })
		.trim()
		.optional()
		.or(z.literal('')),
	category: z
		.enum(['A', 'H', 'O', 'P', 'I','']),
	phoneNumber1: z
		.string()
		.regex(/^(?:\+33|0)[1-9](?:[0-9]{8})$/, { 
			message: 'Please enter a valid French phone number' 
		})
		.optional()
		.or(z.literal('')),
	phoneNumber2: z
		.string()
		.regex(/^(?:\+33|0)[1-9](?:[0-9]{8})$/, { 
			message: 'Please enter a valid French phone number' 
		})
		.optional()
		.or(z.literal('')),
	siretNumber: z
		.string()
		.length(14, { message: 'SIRET number must be 14 digits' })
		.regex(/^\d{14}$/, { message: 'SIRET number must be 14 digits' })
		.optional()
		.or(z.literal('')),
	website1: z
		.url({ message: 'Please enter a valid URL1' })
		.optional()
		.or(z.literal('')),
	website2: z
		.url({ message: 'Please enter a valid URL2' })
		.optional()
		.or(z.literal('')),
	website3: z
		.url({ message: 'Please enter a valid URL3' })
		.optional()
    	.or(z.literal('')),
});
export type ProducerSchema = z.infer<typeof producerSchema>;
